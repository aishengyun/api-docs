# HTTP 文本转语音接口

本接口支持两种输出模式：直接生成音频文件或使用 Server-Sent Events (SSE) 进行流式输出。

---

## 标准接口

### 基本信息
- 请求方式：`POST`
- 接口地址：`http://api.aishengyun.cn/v1/audio/speech`

### 请求头
| 请求头          | 值                | 是否必需 | 说明               |
|----------------|-------------------|----------|-------------------|
| Authorization  | Bearer <your_api_key> | 是 | API 认证密钥 |
| Accept         | text/event-stream | 否      | 启用 SSE 流式输出   |

### 请求参数
| 参数名 | 类型 | 是否必需 | 说明 |
|--------|------|----------|------|
| model_id | string | 是 | 模型标识符，当前使用 `emotion-tts-v1` |
| transcript | string | 是 | 需要转换的文本内容 |
| voice | object | 是 | 声音配置对象 |
| output_format | object | 是 | 输出格式配置 |
| language | string | 否 | 语言设置 |

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

---

### 二进制流响应说明
- 响应内容：直接返回音频文件二进制流
- Content-Disposition 头：包含建议的文件名。示例：`attachment; filename=bf7956ba-33ed-4286-bcbb-3fd8445b824b.wav`

注意：您可以使用响应头中的文件名或自定义文件名保存音频文件。

#### 命令行

```bash
curl --location 'https://api.aishengyu.cn/v1/audio/speech' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_api_key>' \
--data '{
  "model_id": "emotion-tts-v1",
  "voice": {
    "mode": "id",
    "id":  "zh_female_tianmei"
  },
  "output_format": {
    "container": "wav",
    "encoding": "pcm_s16le",
    "sample_rate": 24000
  },
  "language": "zh",
  "transcript": "哎呀，你来找我啦！今天过得怎么样呀？我今天看到院子里的花开了呢，可漂亮啦！你想不想和我一起去看看呀？"
}' --output output.wav
```

#### Python 代码

```python
import json
import httpx

speech_url = "https://api.aishengyun.cn/v1/audio/speech"

headers = {
  'Authorization': f"Bearer <your_api_key>",
  'Content-Type': 'application/json'
}

message = {
  "model_id": "emotion-tts-v1",
  "voice": {
    "mode": "id",
    "id":  "zh_female_tianmei"
  },
  "output_format": {
    "container": "wav",
    "encoding": "pcm_s16le",
    "sample_rate": 24000
  },
  "language": "zh",
  "transcript": "哎呀，你来找我啦！今天过得怎么样呀？我今天看到院子里的花开了呢，可漂亮啦！你想不想和我一起去看看呀？"
}

with httpx.stream("POST", speech_url, headers=headers, data=json.dumps(message)) as res:
  # should like audio/wav;codec=pcm;rate=24000, otherwise authorization error or input message error
  print(res.headers["content-type"])
  file_name = res.headers["content-disposition"].split("filename=")[1]
  # write to file
  with open(file_name, "wb") as f:
    for chunk in res.iter_raw():
      f.write(chunk)
```

---

### Server-Sent Events 流式输出响应说明

Server-Sent Events (SSE) 是一种服务器向客户端推送流式数据的技术。它适用于无需频繁与服务器进行交互的场景，只需服务器持续生成和推送流式音频数据即可满足需求。

```json
{ "type": "chunk", "status_code": 206, "data": "Base64 string", "done": false, "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"}
{ "type": "chunk", "status_code": 206, "data": "Base64 string", "done": false, "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"}
// tts task is done
{ "type": "done", "status_code": 200, "done": true, "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072" }
// if something error
{ "type": "error", "status_code": 400, "error": "something happened", "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072" }
```

### Python 代码

```python

import json
import httpx
import base64
from httpx_sse import connect_sse
  
file_name = "sse-output.wav"
speech_url = "https://api.aishengyun.cn/v1/audio/speech"

headers = {
  'Authorization': f"Bearer <your_api_key>",
  'Content-Type': 'application/json'
}

message = {
  "model_id": "emotion-tts-v1",
  "voice": { "mode": "id", "id": "jp_female_mayumi" },
  "output_format": {
    "container": "wav", 
    "encoding": "pcm_s16le",
    "sample_rate": 24000, 
  }, 
  "language": "jp", 
  "transcript": "こんにちは、あなたはとても優しい人だと思います、周りに面白い物語がたくさんありますね、教えてくれませんか？"
}

with httpx.Client() as client:
  with connect_sse(client, "POST", speech_url, headers=headers, data=json.dumps(message)) as event_source:
    with open(file_name, "wb") as f:
      for sse in event_source.iter_sse():
        data = json.loads(sse.data)
        # inference done
        if sse.event == "done":
          print(f"Save to {file_name}")
        # chunk data
        if sse.event == "chunk":
          f.write(base64.b64decode(data.get("data")))
```
