---
title: 趋向系统的原理和使用
description: 《以交易为生》（原书第2版）读书笔记
date: 2026-07-26
tags:
  - trading
  - trading-psychology
  - reading-notes
  - the-new-trading-for-a-living
  - disciplined-trading
status: active
license: all-rights-reserved
copyright: © freer.top
book: the-new-trading-for-a-living-reading-notes
part: 第 4 章
partOrder: 5
chapterOrder: 21
chapterLabel: Note 21
---
## 原文引用

> 趋向系统是一种趋势跟随的方法，由威尔斯·威尔德（J. Welles Wilder, Jr.），在 20 世纪 70 年代中期提出，又经过其他几位分析师的改进。它能指明趋势，并显示什么时候趋势的运动值得去追逐。它能帮助交易者在大趋势的主体部分获利。

**Directional Movement System**（DMS，趋向系统，市场常简称 DMI 指标），发明者：威尔斯·威尔德 J. Welles Wilder，1978 年收录于《技术交易系统新概念》。

《以交易为生》中文译本称之为**趋向系统**；软件里显示为 DMI，包含三根核心曲线：**+DI（正向趋向指标）、-DI（负向趋向指标）、ADX（平均趋向指数）**

一个极易踩坑的核心区分：

1. **+DI、-DI：判断趋势方向**
2. **ADX：只衡量趋势强弱，完全不区分上涨/下跌**

## 一、底层核心原理

趋向系统观察**相邻两根 K 线高低区间的博弈关系**，量化多空双方向外拓展价格区间的能力：

* 如果今日高点向上突破昨日高点 → **多头主动拓展空间，产生 +DM 正向趋向值**
* 如果今日低点向下突破昨日低点 → **空头主动拓展空间，产生 -DM 负向趋向值**
* 如果当日 K 线完全被前一日 K 线包裹（高低点没有向外突破）→ DM = 0，多空都无力拓展行情，属于震荡混沌状态。

也就是说：

* 趋向系统不看收盘价，专门观测**多空谁有能力持续打出新高/新低**。
* 震荡行情中，多头、空头轮流突破又失效；
* 趋势行情里，只有一方持续拓展价格区间。

## 二、趋向系统的三大组件分别是什么

### 1. +DI 正向趋向线：多头进攻力量

衡量多头持续向上拓展价格区间的能力；数值越高，多头攻势越强。

### 2. -DI 负向趋向线：空头进攻力量

衡量空头持续向下拓展价格区间的能力；数值越高，空头攻势越强。

方向判定简单规则：

* **+DI > -DI：多头占据主导，市场上行倾向**
* **-DI > +DI：空头占据主导，市场下行倾向**
* 两条线交叉，代表多空力量优势切换。

### 3. ADX 平均趋向指数（Average Directional Index）

ADX = 量化**多空力量差距的平滑值**，只回答一个问题：**市场有没有持续性趋势？趋势强度如何？**

数值区间：0～100

埃尔德在书中沿用威尔德经典阈值：

* **ADX＜20**：市场混沌震荡，没有可持续趋势 → **趋势跟踪策略应当暂停交易**
* **ADX 向上突破 20**：有序趋势正在诞生，趋势值得参与
* ADX 25～40：健康、适合顺势交易的强趋势区间
* ADX 持续走高 = 多空力量差距持续拉大，趋势不断加强
* ADX 从高位拐头向下：趋势动能衰竭，哪怕价格还在创新高/新低，也要警惕反转风险

重点：**ADX 上涨，可以出现在牛市，也可以出现在熊市；ADX 本身不区分涨跌方向！**

## 三、如何使用趋向系统

### 定位：趋向系统属于「趋势跟随指标」，用作**三重滤网第一层大周期过滤器**

第一层滤网任务：分辨「震荡混沌」还是「有序趋势」，锁定唯一可交易方向。

使用逻辑：

1. 先用 ADX 筛选环境：ADX 持续低于20 → 震荡，放弃顺势交易，观望；
2. ADX 站稳 20 以上，确认出现持续性趋势；
3. 对比 +DI 与 -DI，确定趋势方向：
   * +DI 在上：只允许做多、观望，禁止做空
   * -DI 在上：只允许做空、观望，禁止做多

例如：底部震荡阶段 ADX 长期低于 20；当 ADX 自下而上突破 20，同时 +DI 站在 -DI 之上 → 新一轮多头趋势正式启动。

### 埃尔德重要告诫

不要单纯依靠 **+DI、-DI 两条线交叉就直接开仓**！震荡行情里两条 DI 会频繁来回交叉，产生海量虚假信号。

**必须先用 ADX 确认市场存在趋势，交叉信号才有价值。**

## 四、和之前的知识点的联动对比

### 1. 对比 MACD

* MACD 线（DIF/DEA）依靠收盘价 EMA 构建；趋向系统依靠 K 线高低区间构建，捕捉波段高低点拓展能力。
* MACD 双线属于滞后趋势指标；趋向系统**可以客观区分震荡/趋势环境**，弥补均线、MACD 无法量化“有没有趋势”的短板。

### 2. 契合全书核心观点：拒绝主观绘图

趋势线是人主观画出来的；而趋向系统基于高低点数学计算，**高度客观**，不存在人为修改线条角度、一厢情愿解读的问题，契合埃尔德推崇客观指标、警惕主观图表形态的理念。

### 3. 呼应混沌理论

* ADX＜20 = 混沌无序市场，尽量减少交易；
* ADX＞20 = 秩序之岛，顺势策略胜率大幅提升。

## 五、DMS 指标的天然缺陷

1. **滞后性**，属于同步/滞后指标，趋势已经运行一段距离才确认信号；
2. 在急速 V 型反转行情中容易失效；
3. 和所有趋势指标一样：在窄幅震荡区间持续发出噪音，必须严格遵守「ADX＜20不交易」这条规则；
4. 参数默认 14 周期诞生于 70 年代美股，直接套用 A 股短周期，效果会发生变化。

## 七、威尔德原版 ADX 计算公式（标准周期 14）

清层级关系：

$$
DM \rightarrow TR \rightarrow DI \rightarrow DX \rightarrow ADX
$$

符号说明：

* $High$ = 当日最高价，$Low$ = 当日最低价，$Close$ = 当日收盘价
* 下标 $today$ 今日，$prev$ 前一日

### 1. 真实波幅 TR（True Range）

$$
TR = \max \left\{
\begin{aligned}
&\mathrm{High}_{today}-\mathrm{Low}_{today}, \\
&\left|\mathrm{High}_{today}-\mathrm{Close}_{prev}\right|, \\
&\left|\mathrm{Close}_{prev}-\mathrm{Low}_{today}\right|
\end{aligned}
\right\}
$$

### 2. 方向动量 ±DM（Directional Movement）

$$
+DM =
\begin{cases}
\mathrm{High}_{today}-\mathrm{High}_{prev},
& \mathrm{High}_{today}>\mathrm{High}_{prev} \textbf{ 且 } \mathrm{High}_{today}-\mathrm{High}_{prev} > \mathrm{Low}_{prev}-\mathrm{Low}_{today} \\[4pt]
0, & \text{其他情况}
\end{cases}
$$

$$
-DM =
\begin{cases}
\mathrm{Low}_{prev}-\mathrm{Low}_{today},
& \mathrm{Low}_{today}\lt\mathrm{Low}_{prev} \textbf{ 且 } \mathrm{Low}_{prev}-\mathrm{Low}_{today} > \mathrm{High}_{today}-\mathrm{High}_{prev} \\[4pt]
0, & \text{其他情况}
\end{cases}
$$

重点：同一天 $+DM$ 和 $-DM$ **不可能同时大于 0**。

如果 K 线被前一根完全包裹（没有向外扩张高低点）：$+DM=0, -DM=0$

### 3. 平滑处理：ATR 风格移动平均（威尔德平滑，不是标准 EMA/SMA）

威尔德使用**修正移动平均 Wilder’s Smoothing**（很多人混淆成 EMA）

以默认周期 $n=14$ 举例：

$$
\mathrm{ATR}_{today} = \frac{\mathrm{ATR}_{prev}\times (n-1)+\mathrm{TR}_{today}}{n}
$$

$$
+\mathrm{DM}_{\mathrm{smooth}} = \frac{+\mathrm{DM}_{\mathrm{smooth},\,prev}\times (n-1)+\mathrm{DM}_{today}}{n}
$$

$$
-\mathrm{DM}_{\mathrm{smooth}} = \frac{-\mathrm{DM}_{\mathrm{smooth},\,prev}\times (n-1)+(-\mathrm{DM})_{today}}{n}
$$

### 4. 计算 ±DI（方向指标 Directional Index）

$$
+\mathrm{DI}_{today} = \frac{+\mathrm{DM}_{\mathrm{smooth}}}{\mathrm{ATR}_{today}} \times 100
$$

$$
-\mathrm{DI}_{today} = \frac{-\mathrm{DM}_{\mathrm{smooth}}}{\mathrm{ATR}_{today}} \times 100
$$

范围 0～100。

### 5. DX 方向运动指数 (Directional Movement Index)

$$
\mathrm{DX}_{today} = \frac{\left|+\mathrm{DI}_{today} - (-\mathrm{DI}_{today})\right|}{+\mathrm{DI}_{today} + (-\mathrm{DI}_{today})} \times 100
$$

DX 衡量多空两条 DI 的差距：差距越大，DX 越高；震荡时 +DI、-DI 接近，DX 靠近 0。

### 6. ADX 平均方向指数 Average Directional Index

ADX = 对 DX 再次做**威尔德平滑移动平均**

$$
\mathrm{ADX}_{today} = \frac{\mathrm{ADX}_{prev}\times (n-1) + \mathrm{DX}_{today}}{n}
$$

### 简要总结

1. 整套指标原始平滑方式 = **Wilder平滑**，**不是指数移动平均 EMA**，也不是简单均线 SMA；市面上不少软件简化实现直接改用 EMA，会造成指标细微差异。
2. ADX **本身不区分涨跌**，它只衡量：多空力量差距大小，也就是趋势是否存在、强弱如何。
3. 标准原始参数 $n=14$。

## 总结

1. ADX＜20：DX 长期偏低 → +DI 与 -DI 数值接近，多空没有一方持续扩张区间 → 混沌震荡，顺势策略回避；
2. ADX 站稳向上突破 20：多空力量拉开差距，可持续趋势成型；
3. +DI 高于 -DI：多头趋势，只寻找做多机会；
4. -DI 高于 +DI：空头趋势，只寻找做空机会；
5. ADX 持续走高 = 趋势不断加强；ADX 高位拐头 = 多空力量差值收缩，趋势动能衰竭，逐步收紧止盈、不再新开顺势仓位；
6. 趋向系统只负责筛选环境、定大方向，入场点位依然需要第二层滤网震荡指标（MACD 柱、强力指数等）配合寻找回调买点，不可单独作为开仓依据。
