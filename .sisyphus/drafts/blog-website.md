# Draft: 个人博客网站设计

## 技术栈 (已确认)
- Vue 3.5.25 + TypeScript
- Vite 8.0.0-beta.13
- Tailwind CSS 4.2.1
- Vue Router 4.6.4
- Pinia 3.0.4
- @VueUse/core 14.2.1

## 风格参考
- Antfu 的博客 (https://antfu.me/)
- 极简黑白风格
- 单栏居中布局
- 大标题 + 大量留白
- 支持暗色模式

## 功能需求 (已确认)
- [x] 文章列表 + 详情页
- [x] 分类/标签
- [x] 关于页面
- [x] 搜索功能
- [x] 暗色模式

## 内容管理 (已确认)
- 本地 Markdown 文件
- 使用 @vueuse/core 的 `useDark` 做暗色模式

## 设计决策
- 布局: 单栏居中
- 配色: 极简黑白灰 + 蓝色点缀
- 字体: 中文无衬线 + 英文系统字体
- 暗色模式: 必须支持

## 范围边界
- INCLUDE: 首页、文章详情、标签页、关于页、暗色模式
- EXCLUDE: 评论系统、RSS 订阅、CMS 后台
