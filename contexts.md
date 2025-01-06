# Streaming Speech Generation with Context

This document explains how to use WebSocket for context-based streaming speech generation.

> **Note**: In many real-time applications, you may not have complete conversational text for speech generation, especially when utilizing outputs from large language models (LLMs) as user responses. For such cases, **Emotion-TTS** allows direct input of LLM outputs into the API for speech synthesis.

---

## Overview of the Context Mechanism

Our API supports converting real-time outputs from LLMs directly into speech. By leveraging the **context ID** (`context_id`) mechanism, the API can accurately understand the context, enabling seamless and coherent speech output.

### Key Features

- Supports segmented text input  
- Handles tokenized output directly from large language models  
- Ensures coherent and natural speech generation  

---

## Usage Guidelines

### Stream Input Control

- Use `"continue": true` to indicate there will be subsequent input.  
- Use `"continue": false` to signal the end of input.  
- To finalize input, send an empty transcript message (e.g., `"transcript": ""`, `"continue": false`).  

<p class="alert alert-info">To free inactive server resources, a context in the model automatically expires 3 seconds after the final input of your stream. Attempting to send input to the same context ID afterward will implicitly create a new context.<p>


---

### Input Specifications

1. Within the same context, parameters other than `transcript` and `continue` must remain consistent.  
2. Ensure text inputs maintain continuity, for example:  
   ```
   Input 1: "Hello"
   Input 2: ", it's"
   Input 3: " nice"
   Input 4: " to meet"
   Input 5: " you."
   ```
3. The API automatically handles input buffering; no manual control is needed.  
4. Markdown-formatted text can be directly inputted without preprocessing.  

---

### Example

The following example demonstrates how to stream the input "Hello, it's nice to meet you.":

```json
// First input segment
{
    "model_id": "emotion-tts-v1",
    "continue": true,
    "transcript": "Hello",
    "voice": {
        "mode": "id",
        "id": "en_female_orva"
    },
    "output_format": {
        "container": "raw",
        "encoding": "pcm_s16le",
        "sample_rate": 16000
    },
    "language": "en",
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"
}

// ... Intermediate inputs omitted ...

// Final input
{
    "model_id": "emotion-tts-v1",
    "continue": false,
    "transcript": "",
    "voice": {
        "mode": "id",
        "id": "en_female_orva"
    },
    "output_format": {
        "container": "raw",
        "encoding": "pcm_s16le",
        "sample_rate": 16000
    },
    "language": "en",
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"
}
```

---

### Response Format

The API returns audio data chunks in the order of input:

```json
{
    "type": "chunk",
    "status_code": 206,
    "data": "base64-encoded audio data",
    "done": false,
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"
}
// ... Intermediate responses omitted ...

// Final response
{
    "type": "done",
    "status_code": 200,
    "done": true,
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072"
}
```

---

### Canceling Requests

To cancel ongoing speech generation, send the following message:

```json
{
    "context_id": "09dde5c1-1ac9-4434-9860-b97f9a792072",
    "cancel": true
}
```

**Notes on Cancelation**:
- Cancels only affect requests that have not started generation.  
- Requests for audio already in progress will continue to completion.