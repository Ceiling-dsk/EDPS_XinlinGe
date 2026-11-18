---
title: "AI 导师指出错误之后，学生知道下一步怎么做吗？"
date: "2026-11-18"
conference: "NAACL"
year: "2025"
paper_title: "Unifying AI Tutor Evaluation: An Evaluation Taxonomy for Pedagogical Ability Assessment of LLM-Powered AI Tutors"
paper_authors: "Kaushal Kumar Maurya, Kv Aditya Srivatsa, Kseniia Petukhova, Ekaterina Kochmar"
paper_url: "https://aclanthology.org/2025.naacl-long.57/"
summary: "识别错误、定位出错的步骤、给出学生可以尝试的提示。MRBench 把一次数学辅导回复拆开来读，让这些容易混在一起的能力分别显现。"
language: "zh-CN"
sample: true
---

## 从学生算错的那一步读起

设想学生把两边的分母相加，写出“三分之一加三分之一等于六分之二”。一句“再检查一下”给了鼓励，却没有指出可以检查什么。如果导师追问“把同一块饼分成三份，你合起来的每一份变小了吗？”，学生就有了可以尝试的下一步。这是一个为说明评分维度而写的例子。

Maurya 等人把类似的辅导回复分成八个维度来评价。导师是否发现了错误、能否定位到具体步骤、是否给出了正确且相关的指导、学生能否据此行动，都是可以分别追问的问题。

## 同一条回复可以有不同的得分

作者构建的 MRBench 收录了 192 段数学辅导对话和 1,596 条来自模型及人类导师的回复。研究者按八个维度对回复做了人工标注，再比较不同导师的表现。

以论文评估的 GPT-4 为例，它在识别和定位错误上表现较好，却在约 47% 的情境中直接给出了答案。读论文的表 3 时，可以沿着同一行比较“给出指导”和“可操作性”两列，看看一段解释答对了哪些问题，又给学生留下了什么可做的事。

## 留给讨论的问题

如果把评分材料从一条导师回复延长到下一轮学生发言，能多看到什么？可以先根据导师的话预测学生会怎样订正，再对照学生接下来的解释。这样也能把对回复质量的判断，与学生是否理解这一步分别检验。

[阅读论文全文（PDF）](https://aclanthology.org/2025.naacl-long.57.pdf)
