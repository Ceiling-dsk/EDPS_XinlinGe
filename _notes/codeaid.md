---
title: "CodeAid 怎样给编程初学者提示？"
date: "2026-11-18"
conference: "CHI"
year: "2024"
paper_title: "CodeAid: Evaluating a Classroom Deployment of an LLM-based Programming Assistant that Balances Student and Educator Needs"
paper_authors: "Majeed Kazemitabaar, Runlong Ye, Xiaoning Wang, Austin Z. Henley, Paul Denny, Michelle Craig, Tovi Grossman"
paper_url: "https://doi.org/10.1145/3613904.3642773"
summary: "当程序跑出了意料之外的结果，怎样的提示能让学生愿意亲手再试一次？一门 C 语言课里的求助记录，留下了观察这个问题的线索。"
language: "zh-CN"
sample: true
---

## 给出线索，留下一次尝试

学生带着一段有问题的代码来提问，CodeAid 可以在出错的位置加上修改建议。学生要把建议翻译成自己的修改，再运行程序验证。如果学生还在构思解法，工具也可以给出伪代码，逐行解释每一步的作用。

这两种提示把不同的工作留给学生。前一种要求学生诊断已有代码，后一种要求学生把思路写成可运行的程序。读这篇论文时，可以留意学生怎样选择求助的入口。

## 学生实际怎样求助？

在为期 12 周的一门大学 C 语言课中，372 名学生使用过 CodeAid。300 人同意研究者分析他们的记录，留下了 7,003 次初始提问。研究团队还收集了每周问卷，访谈了 22 名学生及 8 名编程教师。

通用问答是最常使用的入口，占初始提问的 38%，代码修复入口占 23%。临近大作业截止日或考试，使用量会增加。有些学生为了核实提示，会专门写一个小程序测试它。这个动作既可能带来一次理解概念的机会，也可能是学生为了排查错误建议而付出的额外工夫。

## 留给讨论的问题

如果两名学生都采纳了同一条提示，一个人先预测运行结果，另一个人直接改代码，怎样记录他们各自学到了什么？一种值得检验的做法，是让他们过几天独立解释一道结构相似的题。论文呈现了学生在课程中的求助过程，长期学习效果仍有待后续研究。

[阅读作者公开的论文全文（PDF）](https://austinhenley.com/pubs/Kazemitabaar2024CHI_CodeAid.pdf)
