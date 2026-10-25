# 熙蒙的手机 · UI 原型

打开 `index.html` 即可预览，无需构建或网络。桌面显示手机，手机浏览器全屏显示。

## 内容编辑

从桌面左侧“打开开发者模式”，或手机“设置 → 开发者模式”进入。可选会话后逐条增删改消息、修改发送者和开放日期；可增加和删除会话；可上传、命名和删除相册照片，也能换壁纸。数据保存在当前浏览器的 localStorage。点击“导出 JSON”备份，换设备时使用“导入 JSON”。大图可能超出浏览器存储配额，建议压缩后上传。

修改默认内容请编辑 `index.html` 中的 `defaults` 数据对象；`threads` 为会话，`messages` 为消息，`photos` 为相册，`notes` 为备忘录。每条记录的 `day` 表示首次可见日期。CSS 顶部的变量控制整体玻璃、颜色和字体；应用图标与主题色在 `apps` 中。

## 当前范围

这是可操作的界面原型，内置文字均标为 DEMO；尚未导入正式剧情，也未连接真实银行、微信或 AI 服务。聊天发送后写入本机记录，不会自动得到对方回复。开发者模式可将全部内容整理成 JSON，以便后续接入正式 D01–D90 文案。

## 已检查

- 用 `node --check` 验证页面脚本语法。
- 独立 HTML 文件，无外部依赖。

## 设计参考

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Anthropic frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design)：借鉴明确的视觉方向和避免模板化设计，不复制第三方 skill 到本仓库。
- [Vercel web-design-guidelines skill](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines)：作为后续交互、可读性审查参考。

此原型位于独立分支和目录，不改变仓库原有项目。
