# WebSocket 接入

!> 在许多实时使用案例中，你没有提前准备好的语音文本。比如当你使用大模型动态生成输入文本时。对于这些情况，我们 WebSocket 接口支持流式输入。

传统的生成方式通过切分成一段一段的文字并对每个部分独立生成语音，然后按顺序拼接成一个完整的语音。这个听起来不错，合并到一起后总有些突然变化的音调和奇怪节奏的语音。

<p class="my-2">
<audio controls src="https://cdn.online-gpt.net/files/without_continuations.wav">
  Your browser does not support the audio element.
</audio>
</p>

现在，让我们尝试通过我们的 API 使用文字生成相同语音。如你所见，此输出听起来无缝且自然。

<p class="my-2">
<audio controls src="https://cdn.online-gpt.net/files/continuations.wav">
  Your browser does not support the audio element.
</audio>
</p>

## 理解上下文

本 API 创建双向 WebSocket 连接。该连接支持多路复用，因此你可以发送多个请求并并行接收相应的响应。

双向 WebSocket API 是围绕上下文构建的：

1. 当你发送生成请求时，你将传递一个 `context_id`。同一个 `context_id` 的连续输入将连续生成音频并保持拟人化的一致性。

2. 模型下发的响应包含你传入的 `context_id` ，以便你可以匹配请求和响应。

请阅读有关[使用上下文的指南](/zh-cn/contexts)以便了解更多信息。

## 使用和性能指导

为了获得更佳性能，我们建议使用以下使用模式：

1. **通过单个 WebSocket 执行多次生成**，只需为每一个相同大模型输出的文字使用同一个的上下文 ID 即可。

2. **在第一次生成之前连接 WebSocket API 接口**，这确保你在开始生成语音时不会产生建立连接延迟。

3. **对话中的每个轮次都应对应于一个上下文**。例如，如果你使用我们的 API 为语音 Agent 如电话客服提供支持，则对话中的每个回合都应该是一个新上下文 ID。

4. **为用户中断启动新的上下文**：假设如果用户在电话里中断了语音 Agent 的回复，请为新的 Agent 响应启用新上下文 ID。

## WebSocket 连接握手

`GET` wss://api.aishengyun.cn/v1/audio/speech

连接身份验证，请参考[使用 API 密钥进行身份验证](/zh-cn/api-overview?id=使用-api-密钥进行身份验证)


## 发送数据

| 参数名 | 类型 | 是否必需 | 说明 |
|--------|------|----------|------|
| model_id | string | 是 | 模型标识符，当前使用 `emotion-tts-v1` |
| transcript | string | 是 | 需要转换的文本内容 |
| voice | object | 是 | 声音配置对象 |
| output_format | object | 是 | 输出格式配置 |
| language | string | 否 | 语言设置 |
| context_id  | string | 是 | 请求的上下文 ID |
| continue  | boolean | 是 | 表示本次请求在上下文里是否继续生成 |

#### voice 对象
| 参数名 | 类型 | 是否必需 | 说明 |
|--------|------|----------|------|
| mode | string | 是 | 声音模式：`id` 或 `embedding` |
| id | string | 条件必需 | 当 mode 为 `id` 时必填，指定[预设声音](/zh-cn/voices) |
| embedding | float[] | 条件必需 | 当 mode 为 `embedding` 时必填，192维声音特征向量 |

#### output_format 对象
| 参数名 | 类型 | 是否必需 | 说明 |
|--------|------|----------|------|
| container | string | 是 | 容器格式：`raw`/`wav`/`mp3` |
| sample_rate | int | 是 | 采样率：`8000`/`16000`/`22050`/`24000`/`32000`/`44100`/`48000` |
| encoding | string | 条件必需 | 非 MP3 格式必填：`pcm_s16le`/`pcm_mulaw`/`pcm_alaw` |
| bit_rate | int | 条件必需 | MP3 格式必填：`32000`/`64000`/`96000`/`128000`/`192000` |

#### language 参数

可选值：
- `auto`: 自动检测
- `en`: 英语
- `zh`: 中文
- `ja`: 日语

## 取消上下文请求

| 名称 | 类型 | 必须 | 解释 |
| ---- | ---- | ---- | ---- |
| context_id  | string | 是 | 要取消的上下文的 ID |
| cancel  | bool | 是 | 是否取消上下文，以便不再为该上下文生成语音。 |


## 接收数据

下发的数据类型分为三种 `chunk`，`done` 和 `error`, 通过 `"type": "done"` 区分是那种数据类型。

### chunk 数据

| 名称 | 类型 |  解释 |
| ---- | ---- | ---- |
| type  | string | 值为 `chunk` |
| status_code  | int | 对应 HTTP status code |
| data  | string | Base64 编码的语音流 |
| done  | bool |  是否完成本次上下文的生成任务 |
| context_id  | string | 请求的上下文 ID |

### done 数据


| 名称 | 类型 |  解释 |
| ---- | ---- | ---- |
| type  | string | 值为 `done` |
| status_code  | int | 对应 HTTP status code |
| done  | bool |  是否完成本次上下文的生成任务 |
| context_id  | string | 请求的上下文 ID |


### error 数据

| 名称 | 类型 |  解释 |
| ---- | ---- | ---- |
| type  | string | 值为 `error` |
| status_code  | int | 对应 HTTP status code |
| error  | string | 对应的错误信息 |
| done  | bool |  是否完成本次上下文的生成任务 |
| context_id  | string | 请求的上下文 ID |


下面是发送和接收数据事例，你也可以下载 [API 例子](https://cdn.online-gpt.net/files/examples.zip)亲自体验。

<!-- panels:start -->

```json
// 发送
{"model_id": "emotion-tts-v1","voice": {"mode": "id","id": "yunxiaochun"},"output_format": {"container": "raw","encoding": "pcm_s16le","sample_rate": 16000}, "language": "zh","transcript": "你好","context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072","continue": true}
{"model_id": "emotion-tts-v1","voice": {"mode": "id","id": "yunxiaochun"},"output_format": {"container": "raw","encoding": "pcm_s16le","sample_rate": 16000}, "language": "zh","transcript": "，很","context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072","continue": true}
{"model_id": "emotion-tts-v1","voice": {"mode": "id","id": "yunxiaochun"},"output_format": {"container": "raw","encoding": "pcm_s16le","sample_rate": 16000}, "language": "zh","transcript": "高兴","context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072","continue": true}
// 接收
{ "type": "chunk", "status_code": 206, "data": "aSDinaTvuI8gbWludGxpZnk=", "done": false, "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072" }
{ "type": "chunk", "status_code": 206, "data": "aSDinaTvuI8gbWludGxpZnk=", "done": false, "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072" }
// 发送
{"model_id": "emotion-tts-v1","voice": {"mode": "id","id": "yunxiaochun"},"output_format": {"container": "raw","encoding": "pcm_s16le","sample_rate": 16000}, "language": "zh","transcript": "见到","context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072","continue": true}
{"model_id": "emotion-tts-v1","voice": {"mode": "id","id": "yunxiaochun"},"output_format": {"container": "raw","encoding": "pcm_s16le","sample_rate": 16000}, "language": "zh","transcript": "你。","context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072","continue": true}
// 接收
{ "type": "chunk", "status_code": 206, "data": "aSDinaTvuI8gbWludGxpZnk=", "done": false, "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072" }
{ "type": "chunk", "status_code": 206, "data": "aSDinaTvuI8gbWludGxpZnk=", "done": false, "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072" }
// 发送
{"transcript": "", "continue": false, "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072","model_id": "emotion-tts-v1","voice": {"mode": "id","id": "yunxiaochun"},"output_format": {"container": "raw","encoding": "pcm_s16le","sample_rate": 16000}, "language": "zh"}
// 接收
{ "type":"done", "status_code":200, "done":true, "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"}
```

<!-- panels:end -->


