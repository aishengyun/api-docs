# API Overview

## Endpoint Addresses

- **HTTP Request Base URL**: `https://api.aishengyun.com`  
- **WebSocket Request Base URL**: `wss://api.aishengyun.com`

---

## Version Compatibility

To ensure backward compatibility of the API, we may introduce the following non-breaking updates:

- Adding optional request parameters  
- Including new fields in the response  
- Optimizing the response format for specific error types  

---

## Authentication

All API requests require authentication using an API key.

### HTTP Request Authentication

Use the Bearer authentication method by adding the following header:  
```http
Authorization: Bearer <your_api_key>
```

### WebSocket Authentication

Two authentication methods are supported:

1. **Bearer Authentication**: Same as HTTP requests (not supported by browser-based WebSocket clients due to the lack of `Authorization` headers).  
2. **WebSocket Protocol Authentication**: Suitable for browser environments, with the format:  
   ```
   tts, api-key.<your_api_key>
   ```

Example code:  
```javascript
const url = 'wss://api.aishengyun.com/v1/audio/speech';
const apiKey = '<your_api_key>';
const ws = new WebSocket(`${url}`, [
    'tts',
    `api-key.${apiKey}`,
]);
```

---

## Response Status Codes

The API uses standard HTTP status codes to indicate request results. For detailed explanations of status codes, refer to the [Mozilla MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

---

## Data Transmission Methods

- **GET Requests**: Parameters are passed via the URL query string.  
- **POST Requests**: Two formats are supported:  
  - **JSON Format**: Use the header `Content-Type: application/json`.  
  - **Multipart Form Data**: Use the header `Content-Type: multipart/form-data`.