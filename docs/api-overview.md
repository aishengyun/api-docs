---
sidebar_position: 1
---
# API 概述

## 接口地址

- HTTP 请求基础地址：`https://api.aishengyun.cn`
- WebSocket 请求基础地址：`wss://api.aishengyun.cn`

## 版本兼容性

为确保 API 的向后兼容性，我们可能会进行以下非破坏性更新：

- 新增可选的请求参数
- 在响应中添加新的字段
- 优化特定错误类型的响应格式

## 认证方式

所有 API 请求都需要使用 API 密钥进行身份认证。

### HTTP 请求认证

使用 Bearer 认证方式，在请求头中添加：
```
Authorization: Bearer <your_api_key>
```

### WebSocket 认证

支持两种认证方式：

1. Bearer 认证：与 HTTP 请求相同。
2. WebSocket Protocol 认证：适用于浏览器环境，（浏览器端的 WebSocket不支持 Authorization 头，但支持 Sec-WebSocket-Protocol 头），格式为：
   ```
   tts, api-key.<your_api_key>
   ```

示例代码：

```javascript
const url = 'wss://api.aishengyun.cn/v1/audio/speech'
const apiKey = '<your_api_key>'
const ws = new WebSocket(`${url}`, [
    'tts',
    `api-key.${apiKey}`,
]);
```

## 响应状态码

API 使用标准的 HTTP 状态码表示请求结果。详细状态码说明请参考 [Mozilla MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)。

## 数据传输方式

- GET 请求：参数通过 URL 查询字符串传递
- POST 请求：支持以下两种格式
  - JSON 格式（Content-Type: application/json）
  - 多部分表单（Content-Type: multipart/form-data）