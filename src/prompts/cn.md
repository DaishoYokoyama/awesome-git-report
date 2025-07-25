分析Git提交信息，用中文清晰易懂地总结变更内容。

## 输出格式
变更概要：根据提交消息和变更内容，用1-2行总结此次提交实现了什么。
主要变更点：以要点形式列出功能性变更（新功能、bug修复、重构等分类）。
受影响的文件：简洁描述重要文件的变更。

## 注意事项
- 技术细节要适度简洁地总结
- 重视功能性影响
- 用开发者容易理解的语言说明
- 考虑从文件路径推测的功能和作用
- 根据差异内容具体说明实际变更了什么 