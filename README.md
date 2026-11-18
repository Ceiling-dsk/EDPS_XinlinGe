# Xinlin Ge · 个人主页

[打开主页](https://ceiling-dsk.github.io/EDPS_XinlinGe/) · [会议论文博客](https://ceiling-dsk.github.io/EDPS_XinlinGe/blog/)

## 在网页上写一篇笔记

1. 打开仓库的 `_notes` 文件夹，复制一篇示例的内容。点击 **Add file → Create new file**，输入简短、固定的文件名，例如 `lak-learning-feedback.md`。它的公开链接会以 `/blog/lak-learning-feedback/` 结尾。[查看 Markdown 示例](_notes/codeaid.md)
2. 在开头的两行 `---` 之间填写笔记标题、摘要、笔记发表日期（`YYYY-MM-DD`）、会议简称、论文年份、论文原题、作者及原文链接。自己的笔记填写 `sample: false`，中文笔记保留 `language: "zh-CN"`。在第二行 `---` 下写正文，用 `##` 开始一个小节。
3. 选择 **Commit changes**，提交或合并到 `main`。GitHub Pages 会更新文章独立页面、会议筛选和首页最近两篇笔记。可以在仓库的 **Actions → pages build and deployment** 查看发布进度。

修改已发表的笔记时，打开对应的 Markdown 文件，点击铅笔图标。保留原文件名，已分享的文章链接就可以继续使用。

## 更新工作记录日历

在装有 Work_log 的电脑上打开仓库根目录，运行以下命令。

```sh
python3 _tools/export_activity.py
```

将更新后的 `assets/activity-data.js` 提交到 `main`，日历就会显示新的快照日期和每日条数。日志正文、项目名称和数据库保存在本机。使用自定义数据库路径时，可在命令末尾加上 `--database "/path/to/okr.db"`。[导出脚本](_tools/export_activity.py)
