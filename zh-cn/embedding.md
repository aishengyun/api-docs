# 声音克隆指南

<p class="alert alert-warning">请注意：此功能目前处于实验阶段，API 接口可能会有变动</p>

## 最佳实践

为获得最佳的声音克隆效果，请遵循以下建议：

### 录音要求
1. **选择合适的朗读内容**
   - 避免单调的朗读文本
   - 使用与实际应用场景相符的内容
   - 确保朗读内容包含适当的情感表达

2. **保证录音质量**
   - 使用高质量麦克风
   - 选择安静的录音环境
   - 避免有回声的空间
   - 尽量减少背景噪音

3. **录音技巧**
   - 保持清晰的发音
   - 避免过长的停顿
   - 使用目标语言录音（如需日语声音，请用日语录制）

## API 接口说明

### 基本信息
- 请求方式：`POST`
- 接口地址：`http://api.aishengyun.cn/v1/audio/embedding`

### 请求头
| 请求头 | 值 | 是否必需 | 说明 |
|--------|-----|----------|------|
| Authorization | Bearer <your_api_key> | 是 | API 认证密钥 |

### 请求参数
| 参数名 | 类型 | 是否必需 | 说明 |
|--------|------|----------|------|
| file | file | 是 | 语音文件（限制30秒以内） |

### 响应参数
| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 声音克隆标识符 |
| embedding | float[] | 192维声音特征向量 |

### 命令行

```bash
curl --location 'https://speech.act-gpt.com/v1/audio/embedding' \
--header 'Authorization: Bearer <your_api_key>' \
--form 'file=@"<your_audio_file>"'
```

### Python 代码

```python
import httpx
from pathlib import Path

file = "<your_audio_file>"
embedding_url = "https://speech.act-gpt.com/v1/audio/embedding"
headers = {
  "Authorization": "Bearer <your_api_key>"
}

files=[('file',Path(file).name, open(file,'rb'), 'audio/mpeg'))]
# send to server
res = httpx.post(embedding_url, headers=headers, files=files)
print(res.json().get("embedding"))

```
