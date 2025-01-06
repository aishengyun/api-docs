# Voice Cloning Guide

> **Warning**: This feature is currently experimental, and the API interface may be subject to changes.

---

## Best Practices

To achieve the best voice cloning results, follow these recommendations:

### **Recording Requirements**

1. **Select Suitable Reading Material**  
   - Avoid monotonous reading scripts.  
   - Use content aligned with the intended application scenario.  
   - Ensure the reading material includes appropriate emotional expression.

2. **Ensure High-Quality Recording**  
   - Use a high-quality microphone.  
   - Record in a quiet environment.  
   - Avoid spaces with echo.  
   - Minimize background noise as much as possible.

3. **Recording Techniques**  
   - Speak clearly and distinctly.  
   - Avoid long pauses.  
   - Record in the target language (e.g., use Japanese if creating a Japanese voice).

---

## API Interface Details

### **Basic Information**

- **Method**: `POST`  
- **Endpoint**: `https://api.aishengyun.com/v1/audio/embedding`

---

### **Request Headers**

| Header          | Value                 | Required | Description       |
|------------------|-----------------------|----------|-------------------|
| Authorization    | Bearer `<your_api_key>` | Yes      | API authentication token |

---

### **Request Parameters**

| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| file      | file   | Yes      | Audio file (max 30 seconds) |

---

### **Response Parameters**

| Parameter  | Type      | Description                  |
|------------|-----------|------------------------------|
| id         | string    | Unique identifier for the cloned voice |
| embedding  | float[]   | 192-dimensional voice feature vector |

---

## Example Usage

### **Command Line Example**

```bash
curl --location 'https://api.aishengyun.com/v1/audio/embedding' \
--header 'Authorization: Bearer <your_api_key>' \
--form 'file=@"<your_audio_file>"'
```

---

### **Python Example**

```python
import httpx
from pathlib import Path

# Define file and endpoint
file = "<your_audio_file>"
embedding_url = "https://api.aishengyun.com/v1/audio/embedding"

# Prepare headers and file data
headers = {
    "Authorization": "Bearer <your_api_key>"
}
files = {
    'file': (Path(file).name, open(file, 'rb'), 'audio/mpeg')
}

# Send request
response = httpx.post(embedding_url, headers=headers, files=files)

# Extract and print embedding vector
embedding = response.json().get("embedding")
print(embedding)
```

---

## Notes:

- Ensure the audio file is **30 seconds or shorter**. Longer files may result in errors.  
- The response `embedding` can be used to replicate the target voice in TTS services or other voice synthesis applications.  
- Use consistent API keys for authentication to maintain access continuity.