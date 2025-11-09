# MoodTune - 音乐情感分析仪表板

一个可视化用户音乐收听习惯和情感趋势的前端仪表板项目，集成了 AI 驱动的推荐功能。

## 功能特点

1. **收听时间线**: 柱状图显示每日收听时间
2. **情感雷达**: 雷达图展示四种情感（快乐、忧郁、活力、平静）的分布
3. **AI 推荐**: 基于情感分析生成心情摘要和推荐流派
4. **AI 驱动摘要**: 通过 Flask 后端生成个性化的心情摘要和音乐推荐

## 项目结构

```
MoodTune/
├── index.html          # 主 HTML 文件
├── style.css           # 样式文件
├── app.js              # 前端 JavaScript 逻辑
├── emotions.json       # 示例音乐数据
├── server.py           # Flask 后端服务器
└── requirements.txt    # Python 依赖
```

## 快速开始

### 方法一：使用批处理脚本（Windows 推荐）

1. **安装依赖**（首次运行）
   ```bash
   pip install -r requirements.txt
   ```

2. **启动后端服务器**
   - 双击 `start_backend.bat` 文件
   - 或者右键选择"以管理员身份运行"

3. **启动前端服务器**（新开一个终端或窗口）
   - 双击 `start_frontend.bat` 文件

4. **访问应用**
   - 打开浏览器访问 `http://localhost:8000`

### 方法二：使用命令行

1. **安装 Python 依赖**
   ```bash
   pip install -r requirements.txt
   ```

2. **启动 Flask 后端服务器**
   ```bash
   python server.py
   ```
   后端服务器将在 `http://localhost:5000` 运行。

3. **启动前端服务器**（新开一个终端窗口）
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 或使用 Node.js
   npx http-server -p 8000
   ```
   前端应用将在 `http://localhost:8000` 运行。

### 方法三：使用 VS Code

1. **安装依赖**
   ```bash
   pip install -r requirements.txt
   ```

2. **启动后端**
   - 在 VS Code 终端运行 `python server.py`

3. **启动前端**
   - 安装 "Live Server" 扩展
   - 右键 `index.html` → "Open with Live Server"

## 📖 详细运行指南

查看 [启动指南.md](启动指南.md) 获取更详细的说明和常见问题解答。

## API 端点

### POST /generate-summary

生成 AI 心情摘要和推荐流派。

**请求体:**
```json
{
  "songs": [
    {
      "title": "歌曲名",
      "emotions": {
        "joyful": 0.8,
        "melancholic": 0.1,
        "energetic": 0.3,
        "calm": 0.9
      }
    }
  ]
}
```

**响应:**
```json
{
  "mood_summary": "心情摘要文本",
  "suggested_genres": ["流派1", "流派2", ...]
}
```

### GET /health

健康检查端点，返回服务器状态。

## 使用说明

1. 打开浏览器访问 `http://localhost:8000`
2. 页面会自动加载 `emotions.json` 中的数据并显示可视化图表
3. 点击 "🤖 生成心情摘要" 按钮，调用 Flask 后端 API 生成 AI 推荐
4. AI 生成的心情摘要和推荐流派将显示在页面上

## 技术栈

- **前端**: HTML, CSS, JavaScript
- **可视化**: Chart.js
- **后端**: Flask (Python)
- **API**: RESTful API with CORS support

## 注意事项

- 确保 Flask 后端服务器在端口 5000 运行，前端才能正常调用 AI 功能
- 如果遇到 CORS 错误，请检查 Flask 后端的 CORS 配置
- 示例数据位于 `emotions.json` 文件中，可以根据需要修改

## 开发说明

- `server.py` 中的 `simulate_openai_api()` 函数是一个占位函数，模拟 OpenAI API 调用
- 在实际生产环境中，可以替换为真实的 OpenAI API 调用
- 前端代码支持错误处理，如果后端服务器未运行，会显示相应的错误消息

## 许可证

MIT License

