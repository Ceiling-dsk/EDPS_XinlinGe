# Xinlin Ge · 个人主页

[打开主页](https://ceiling-dsk.github.io/EDPS_XinlinGe/) · [会议论文博客](https://ceiling-dsk.github.io/EDPS_XinlinGe/blog/)

## 在网页上写一篇笔记

1. 打开仓库的 `_notes` 文件夹，复制一篇示例的内容。点击 **Add file → Create new file**，输入简短、固定的文件名，例如 `lak-learning-feedback.md`。它的公开链接会以 `/blog/lak-learning-feedback/` 结尾。[查看 Markdown 示例](_notes/codeaid.md)
2. 在开头的两行 `---` 之间填写笔记标题、摘要、笔记发表日期（`YYYY-MM-DD`）、会议简称、论文年份、论文原题、作者及原文链接。自己的笔记填写 `sample: false`，中文笔记保留 `language: "zh-CN"`。在第二行 `---` 下写正文，用 `##` 开始一个小节。
3. 选择 **Commit changes**，提交或合并到 `main`。GitHub Pages 会更新文章独立页面、会议筛选和首页最近两篇笔记。可以在仓库的 **Actions → pages build and deployment** 查看发布进度。

修改已发表的笔记时，打开对应的 Markdown 文件，点击铅笔图标。保留原文件名，已分享的文章链接就可以继续使用。

## 工作记录与首页日历

平时在私有工作记录网站登录后填写或修改日志。手机和电脑使用同一个账户即可继续记录。首页的 **Open my work log** 也通向这个入口。[打开私有工作记录](https://xinlin-private-worklog.trail-lab-5383.chatgpt.site/)

线上工作记录会把每天的条数同步到公开日历。访问或刷新主页即可查看，切回已打开的主页也会重新读取。公开数据包括统计截止日期和每日条数，日志正文和项目名称保存在私有工作记录中。[查看首页日历](https://ceiling-dsk.github.io/EDPS_XinlinGe/#work-log) · [查看公开统计](https://xinlin-worklog-calendar.vercel.app/api/activity)

如果暂时无法获取在线统计，日历会说明连接状态，并标出备用数据的截止日期。本机旧版 Work_log 作为独立备份保留，后续在本机的修改只保存在本机。需要用旧版数据更新随站备用快照时，可在装有 Work_log 的电脑上，从本仓库根目录运行以下命令。

```sh
python3 _tools/export_activity.py
```

将生成的 `assets/activity-data.js` 提交到 `main`，即可更新备用快照。自定义数据库路径可通过 `--database "/path/to/okr.db"` 指定。[导出脚本](_tools/export_activity.py)
