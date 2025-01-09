# Choosing an TTS Endpoints

To help you make the most of the AiVoice Cloud TTS service, we offer two integration options: **WebSocket Real-Time Interface** and **HTTP Standard Interface**. Below are the details:

---

## WebSocket Real-Time Speech Generation

This method is ideal for scenarios requiring real-time interaction and offers the following advantages:

### **Low Latency**

- WebSocket connections can be pre-established, eliminating connection setup delays (approximately 200ms saved).  
- Best suited for real-time applications with high responsiveness requirements.

### **Streaming Capability**

- Supports simultaneous input and speech output generation.  
- Particularly effective when paired with large language models, converting model output directly into speech.  
- Includes a built-in intelligent buffering mechanism (buffering around 10–30 characters) to ensure natural, smooth voice output and avoid mechanical effects.

### **Multi-Session Support**

- Enables multi-session management using `context_id`.  
- A single connection can handle multiple conversations simultaneously, improving resource efficiency.

---

## HTTP Offline Speech Generation

This method is suitable for scenarios where speech content needs to be generated in advance:

### **Features**

- Supports various audio output formats, including **WAV** and **MP3**.  
- Ideal for batch speech generation.   

**Note**: PCM format output is not recommended for direct use due to the lack of audio format definition, which may cause playback issues on local devices.

---

### Recommendations:

- **For Real-Time Interaction Scenarios** (e.g., conversational bots): Choose the **WebSocket Interface**.  
- **For Pre-Generated Content Scenarios** (e.g., audiobook production): Choose the **HTTP Interface**.