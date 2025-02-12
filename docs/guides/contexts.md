---
sidebar_position: 3
---
# 使用上下文进行流式语音生成

本文档介绍如何使用 WebSocket 进行基于上下文的流式语音生成。

!> 在许多实时应用的使用案例中，你没有实时语音的对话文本。特别是当你使用大模型输出做为用户的语音回答。对于这些情况，Emotion-TTS 支持从 LLM 大模型的输出直接输入到 API 中。

## 上下文机制概述

我们的 [WebSocket API](/api/speech/websocket) 支持将大语言模型的实时输出直接转换为语音。通过上下文 ID（context_id）机制，API 可以准确理解语境，实现连贯的语音输出。

### 核心特点

- 支持分段输入文本
- 可直接处理大语言模型的 token 输出
- 保持语音输出的连贯性和自然度

## 使用说明

### 流式输入控制
- 使用 `continue: true` 表示后续还有输入
- 使用 `continue: false` 表示输入结束
- 结束输入时可发送空文本消息（ `transcript: ""`, `continue: false` ）

:::tip

为了释放服务器的非活动资源，一个在模型里运行的上下文在你流式输入的最后一次输入 3 秒后自动过期，之后尝试在同一上下文 ID 上发送输入将隐式创建新上下文。

:::

### 输入规范

1. 同一上下文中，除 `transcript` 和 `continue` 外的参数应保持一致
2. 文本应确保前后连贯，例如：
   ```
   输入1: "你好"
   输入2: "，很"
   输入3: "高兴"
   输入4: "见到"
   输入5: "你。"
   ```
3. API 会自动处理输入缓冲，无需手动控制
4. 支持直接输入 markdown 格式文本，无需预处理

### 示例

以下示例展示如何流式输入 "你好，很高兴见到你。"：

```json
// 第一段输入
{
    "model_id": "emotion-tts-v1",
    "continue": true,
    "transcript": "你好",
    "voice": {
        "mode": "id",
        "id": "zh_female_tianmei"
    },
    "output_format": {
        "container": "raw",
        "encoding": "pcm_s16le",
        "sample_rate": 16000
    },
    "language": "zh",
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"
}

// ... 中间输入省略 ...

// 结束输入
{
    "model_id": "emotion-tts-v1",
    "continue": false,
    "transcript": "",
    "voice": {
        "mode": "id",
        "id": "zh_female_tianmei"
    },
    "output_format": {
        "container": "raw",
        "encoding": "pcm_s16le",
        "sample_rate": 16000
    },
    "language": "zh",
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"
}
```

### 响应格式

API 会按输入顺序返回音频数据块：

```json
{
    "type": "chunk",
    "status_code": 206,
    "data": "base64 编码的音频数据",
    "done": false,
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"
}
// ... 中间输入省略 ...

// 最终完成响应
{
    "type": "done",
    "status_code": 200,
    "done": true,
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"
}
```

### 取消请求

如需取消正在进行的语音生成，发送以下消息：

```json
{
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072",
    "cancel": true
}
```

取消请求说明：
- 仅影响未开始生成的请求
- 已开始生成的音频会继续完成