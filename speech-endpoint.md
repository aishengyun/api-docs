# HTTP Text-to-Speech (TTS) API Documentation

This guide details how to use the HTTP TTS API, supporting both standard audio file generation and real-time audio streaming via Server-Sent Events (SSE).

---

## Standard HTTP API

### Basic Information

- **Method**: `POST`
- **Endpoint**: `http://api.aishengyun.com/v1/audio/speech`

---

### Request Headers

| **Header**       | **Value**                 | **Required** | **Description**         |
|------------------|--------------------------|--------------|-------------------------|
| Authorization    | Bearer `<your_api_key>`   | Yes          | API authentication key |
| Accept           | text/event-stream        | No           | Enable SSE streaming    |

---

### Request Parameters

| **Parameter**  | **Type**   | **Required** | **Description**                                      |
|----------------|-----------|--------------|----------------------------------------------------|
| model_id       | string    | Yes          | Model identifier, e.g., `emotion-tts-v1`          |
| transcript     | string    | Yes          | Text content to convert to speech                 |
| voice          | object    | Yes          | Voice configuration object                        |
| output_format  | object    | Yes          | Output format configuration                       |
| language       | string    | No           | Language setting (default: `auto`)               |

---

#### Voice Object

| **Parameter** | **Type**    | **Required**       | **Description**                                  |
|---------------|------------|--------------------|------------------------------------------------|
| mode          | string     | Yes                | Voice mode: `id` or `embedding`                |
| id            | string     | Required if `mode` = `id` | Predefined voice identifier               |
| embedding     | float[]    | Required if `mode` = `embedding` | 192-dimensional voice feature vector |

---

#### Output Format Object

| **Parameter** | **Type** | **Required** | **Description**                                          |
|---------------|---------|--------------|--------------------------------------------------------|
| container     | string  | Yes          | Output format: `raw`, `wav`, or `mp3`                 |
| sample_rate   | int     | Yes          | Sampling rate (e.g., `24000`, `44100`)                |
| encoding      | string  | Conditional  | Required for non-MP3 formats: `pcm_s16le`, `pcm_mulaw`, `pcm_alaw` |
| bit_rate      | int     | Conditional  | Required for MP3 format (e.g., `128000`)              |

---

#### Language Parameter

| **Value** | **Description**                          |
|-----------|------------------------------------------|
| auto      | Automatically detect the language        |
| en        | English                                  |
| zh        | Chinese                                  |
| ja        | Japanese                                 |

---

### Response

- **Audio File**: Returns a binary stream of the generated audio file.
- **Content-Type Header**: Suggests audio format (e.g., `audio/wav;codec=pcm;rate=24000`).
- **Content-Disposition Header**: Suggests a filename (e.g., `attachment; filename=audio.wav`).

---

### Example Usage

#### Command Line

```bash
curl --location 'https://api.aishengyu.com/v1/audio/speech' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_api_key>' \
--data '{
  "model_id": "emotion-tts-v1",
  "voice": {
    "mode": "id",
    "id":  "en_female_orva"
  },
  "output_format": {
    "container": "wav",
    "encoding": "pcm_s16le",
    "sample_rate": 24000
  },
  "language": "zh",
  "transcript": "I understand your concern, and I’ll do my best to help resolve this issue for you.”"
}' \
--output output.wav \
--fail-with-body \
--silent \
|| (jq . output.wav  && rm output.wav )
```

#### Python Example

```python
import json
import httpx

url = "https://api.aishengyun.com/v1/audio/speech"
headers = {
    "Authorization": "Bearer <your_api_key>",
    "Content-Type": "application/json"
}

data = {
    "model_id": "emotion-tts-v1",
    "voice": {"mode": "id", "id": "en_female_orva"},
    "output_format": {"container": "wav", "encoding": "pcm_s16le", "sample_rate": 24000},
    "language": "en",
    "transcript": "I understand your concern, and I’ll do my best to help resolve this issue for you.”"
}

response = httpx.post(url, headers=headers, json=data)
with open("output.wav", "wb") as f:
    f.write(response.content)
```

---

## Server-Sent Events (SSE) Streaming

### Response Structure

SSE enables real-time audio streaming via chunks.

- **Chunk Response**:
  ```json
  { "type": "chunk", "status_code": 206, "data": "Base64 string", "done": false, "context_id": "unique-id" }
  ```
- **Completion Response**:
  ```json
  { "type": "done", "status_code": 200, "done": true, "context_id": "unique-id" }
  ```
- **Error Response**:
  ```json
  { "type": "error", "status_code": 400, "error": "Error message", "context_id": "unique-id" }
  ```

---

#### Python SSE Streaming Example

```python
import json
import httpx
import base64
from httpx_sse import connect_sse

file_name = "output_stream.wav"
url = "https://api.aishengyun.com/v1/audio/speech"

headers = {
    "Authorization": "Bearer <your_api_key>",
    "Content-Type": "application/json"
}

data = {
    "model_id": "emotion-tts-v1",
    "voice": {"mode": "id", "id": "en_female_orva"},
    "output_format": {"container": "wav", "encoding": "pcm_s16le", "sample_rate": 24000},
    "language": "en",
    "transcript": "I understand your concern, and I’ll do my best to help resolve this issue for you.”"
}

with httpx.Client() as client:
    with connect_sse(client, "POST", url, headers=headers, json=data) as event_source:
        with open(file_name, "wb") as f:
            for sse in event_source.iter_sse():
                event = json.loads(sse.data)
                if sse.event == "chunk":
                    f.write(base64.b64decode(event["data"]))
                elif sse.event == "done":
                    print(f"Audio saved to {file_name}")
```