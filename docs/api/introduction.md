---
sidebar_position: 1
tags:
  - documentation
  - openapi
---
# API 

:::danger

所有端点均使用 HTTPS 协议，不支持 HTTP 协议。要使用 API 之前，请先 创建 [API 密钥](https://console.aishengyun.cn)。

:::


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

## 快速开始

我们提供完整的示例代码帮助您快速接入服务。请下载 [示例代码](https://gitee.com/aishengyun/tts-examples) 开始体验。


## 技术支持

扫描下方二维码加入我们的技术支持群，获取即时帮助：


<img
  src='https://cdn.aishengyun.cn/assets/qr/qrcode_ma.png'
  width="280"
  alt="技术支持群二维码"
/>
