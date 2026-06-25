# 初中知识点背诵系统 - 开发文档

## 一、项目概述

本项目是一个**纯前端静态网站**，用于初中知识点背诵和练习。

### 核心特点
- 无需HTTP服务器，双击HTML即可运行
- 数据内嵌到HTML中（解决CORS本地文件访问限制）
- 支持知识点展开/收起、搜索定位
- 支持错题本功能（localStorage持久化）
- 支持学习进度记录（localStorage持久化）
- 按科目拆分独立HTML页面，优化加载性能

### 技术栈
- 纯 HTML + CSS + JavaScript（ES6+）
- Tailwind CSS（CDN引入）
- localStorage（本地数据持久化）
- Node.js（生成脚本）

---

## 二、项目结构

```
学生复习/
├── index.html                    # 导航首页
├── knowledge_*.html              # 各科目知识点页面
│   ├── knowledge_math.html       # 数学
│   ├── knowledge_physics.html    # 物理
│   ├── knowledge_english.html    # 英语
│   ├── knowledge_english_vocab.html  # 英语词汇背诵（无例题）
│   ├── knowledge_geography.html  # 地理
│   ├── knowledge_chinese.html    # 语文
│   ├── knowledge_chinese_recite.html # 语文重点背诵（无例题）
│   ├── knowledge_history.html    # 历史
│   ├── knowledge_daofa.html      # 道德与法治
│   └── knowledge_biology.html    # 生物
├── wrongbook.html                # 错题本页面
├── css/
│   └── styles.css                # 共享样式
├── data/
│   ├── knowledge/                # 知识点JSON文件
│   └── examples/                 # 例题JSON文件
├── generate_standalone.js        # 生成脚本（核心）
└── DEVELOPMENT.md                # 本文档
```

---

## 三、功能模块

### 3.1 首页 (index.html)

| 功能 | 说明 |
|------|------|
| 年级/科目导航 | 按年级分组展示科目入口 |
| 继续学习卡片 | 显示上次学习记录，一键继续 |
| 科目进度条 | 每个科目显示学习进度（已学/总数） |
| 错题本入口 | 跳转到错题本页面，显示错题数量 |
| 数据统计 | 展示总知识点、总例题、总错题数 |
| 使用说明 | 三步使用指南 |

### 3.2 知识点页面 (knowledge_*.html)

| 功能 | 说明 |
|------|------|
| 学期切换 | 上册/下册切换 |
| 知识点列表 | 卡片式展示，支持展开/收起 |
| 全部展开/收起 | 一键展开或收起所有知识点 |
| 搜索功能 | 按名称或章节搜索知识点 |
| 学习进度统计 | 显示当前学期已学/总知识点 |
| 清除学习进度 | 一键清除当前科目的学习进度（带确认提示） |
| 已学习标记 | 已学知识点绿色边框+标签 |
| 例题弹窗 | 点击例题按钮弹出题目 |
| 换一题 | 随机切换同知识点的其他例题 |
| 加入错题本 | 将题目加入错题本 |
| 锚点跳转 | 支持通过URL锚点定位到指定知识点 |

### 3.3 错题本 (wrongbook.html)

| 功能 | 说明 |
|------|------|
| 错题列表 | 按科目分组展示所有错题 |
| 删除错题 | 移除已掌握的错题 |
| 清空错题 | 一键清空所有错题 |
| 本地存储 | 数据保存在 localStorage |

### 3.4 学习进度记录

| 功能 | 说明 |
|------|------|
| 最后学习记录 | 记录最后学习的科目、知识点、时间 |
| 已学习知识点 | 记录所有展开过的知识点 |
| 每日学习统计 | 按日期记录学习数量和科目 |
| 科目进度 | 首页展示每个科目的学习进度 |
| 继续学习 | 一键跳转到上次学习位置 |
| 清除科目进度 | 清除指定科目的所有学习进度（不影响其他科目） |

---

## 四、文件命名规范

### 4.1 知识点文件

**格式**：`g{年级}_{科目}_{学期}.json`

- 年级：g1=初一，g2=初二，g3=初三
- 科目：math, physics, english, geography, chinese, history, daofa, biology
  - 子科目：chinese_recite（语文重点背诵），english_vocab（英语词汇背诵）
- 学期：upper=上册，lower=下册

**示例**：
```
g2_math_upper.json       初二数学上册
g2_chinese_lower.json    初二语文下册
g2_chinese_recite_upper.json  初二语文重点背诵上册
```

### 4.2 例题文件

**格式**：`g{年级}_{科目}_{学期编号}_{知识点序号}_010.json`

- 学期编号：u=上册，l=下册
- 知识点序号：3位数字，从001开始
- _010：表示每个知识点10道例题

**示例**：
```
g2_math_u001_010.json    初二数学上册第1个知识点的10道例题
g2_physics_l015_010.json 初二物理下册第15个知识点的10道例题
```

### 4.3 知识点ID格式

**格式**：`g{年级}_{科目}_{学期编号}{序号}`

> 注意：数学和物理的旧数据可能没有学期编号（如 g2_math_027），新数据统一使用带 u/l 的格式。

**示例**：
```
g2_math_u001            初二数学上册第1个知识点
g2_chinese_recite_l015   初二语文重点背诵下册第15个知识点
```

---

## 五、数据格式规范

### 5.1 知识点格式

```json
[
  {
    "id": "g2_math_u001",
    "chapter": "上册 第十一章 三角形",
    "name": "三角形的定义及分类",
    "formula": "三角形的定义...",
    "explanation": "【定理内容】...\n【应用场景】...\n【注意事项】...",
    "semester": "upper"
  }
]
```

| 字段 | 说明 |
|------|------|
| id | 唯一标识，格式见4.3 |
| chapter | 章节名称，格式："上册/下册 章节名" |
| name | 知识点名称 |
| formula | 主要内容（公式、定义、原文等） |
| explanation | 详细解释，建议用【】分类标题，用\n换行 |
| semester | 学期标记（upper/lower），由生成脚本自动添加 |

### 5.2 例题格式

```json
[
  {
    "id": "g2_math_u001_ex01",
    "knowledge_id": "g2_math_u001",
    "question": "题目内容...",
    "answer": "答案及解析..."
  }
]
```

| 字段 | 说明 |
|------|------|
| id | 例题唯一标识，格式：知识点ID + _ex + 两位序号 |
| knowledge_id | 对应知识点的ID |
| question | 题目内容 |
| answer | 答案和解析 |

### 5.3 学习进度数据（localStorage）

**Key**: `study_progress`

```javascript
{
  lastStudy: {
    grade: 'g2',
    subject: 'math',
    subjectName: '数学',
    semester: 'upper',
    semesterName: '上册',
    knowledgeId: 'g2_math_u001',
    knowledgeName: '三角形的概念与分类',
    timestamp: '2026-06-22T20:30:00.000Z'
  },
  learnedKnowledge: {
    'g2_math_u001': { learnedAt: '2026-06-22T20:30:00.000Z' },
    'g2_math_u002': { learnedAt: '2026-06-22T20:35:00.000Z' }
  },
  dailyStats: {
    '2026-06-22': { learnedCount: 5, subjects: ['math', 'physics'] }
  }
}
```

### 5.4 错题本数据（localStorage）

**Key 前缀**: `wrongbook_{grade}_{subject}`

```javascript
[
  {
    id: 'g2_math_u001_1687456789000',
    knowledgeId: 'g2_math_u001',
    knowledgeName: '三角形的概念与分类',
    grade: 'g2',
    subject: 'math',
    question: '题目内容...',
    answer: '答案及解析...',
    addedAt: '2026-06-22T20:30:00.000Z'
  }
]
```

---

## 六、科目配置

在 `generate_standalone.js` 中的 `subjects` 对象配置：

```javascript
const subjects = {
    math: { 
        name: '数学', 
        color: 'blue', 
        files: ['g2_math_upper.json', 'g2_math_lower.json'] 
    },
    chinese_recite: { 
        name: '语文重点背诵', 
        color: 'red', 
        files: ['g2_chinese_recite_upper.json', 'g2_chinese_recite_lower.json'], 
        noExamples: true   // 不显示例题功能
    },
    // ...
};
```

| 配置项 | 说明 |
|--------|------|
| name | 科目显示名称 |
| color | 主题色（blue/purple/green/yellow/red/orange/pink/teal） |
| files | 知识点文件数组 [上册, 下册] |
| noExamples | （可选）true=不加载例题，不显示例题按钮 |
| icon | （可选）科目图标 emoji |
| count | （自动计算）知识点总数 |

---

## 七、各科目知识点数量参考（初二）

| 科目 | 上册 | 下册 | 合计 | 例题数 |
|------|------|------|------|--------|
| 数学 | 26 | 27 | 53 | 1060 |
| 物理 | 28 | 30 | 58 | 1160 |
| 英语 | 45 | 42 | 87 | 870 |
| 英语词汇背诵 | 15 | 15 | 30 | 0（无例题） |
| 地理 | 50 | 35 | 85 | 850 |
| 语文 | 30 | 30 | 60 | 600 |
| 语文重点背诵 | 15 | 15 | 30 | 0（无例题） |
| 历史 | 46 | 46 | 92 | 2300 |
| 道德与法治 | 30 | 30 | 60 | 600 |
| 生物 | 33 | 33 | 66 | 660 |
| **合计** | **278** | **273** | **621** | **8100** |

---

## 八、新增年级/科目步骤

### 8.1 新增一个年级（例如初一）

**步骤1：创建知识点文件**
```
data/knowledge/g1_math_upper.json
data/knowledge/g1_math_lower.json
data/knowledge/g1_chinese_upper.json
...
```

**步骤2：创建例题文件**（如果需要例题）
```
data/examples/g1_math_u001_010.json
data/examples/g1_math_u002_010.json
...
```

**步骤3：修改 generate_standalone.js**

在 subjects 中添加新科目配置：
```javascript
const subjects = {
    // ... 原有初二科目 ...
    g1_math: { 
        name: '初一数学', 
        color: 'blue', 
        files: ['g1_math_upper.json', 'g1_math_lower.json'] 
    },
    // ...
};
```

同时需要：
- 在首页添加初一的年级卡片（参考初二的格式）
- 修改 ProgressManager 的年级前缀逻辑（目前写死为 g2_）

**步骤4：生成HTML**
```bash
node generate_standalone.js
```

### 8.2 新增一个子科目（背诵类，无例题）

**步骤1：创建知识点文件**
```
data/knowledge/g2_chinese_recite_upper.json
data/knowledge/g2_chinese_recite_lower.json
```

**步骤2：修改 generate_standalone.js**
```javascript
chinese_recite: { 
    name: '语文重点背诵', 
    color: 'red', 
    files: ['g2_chinese_recite_upper.json', 'g2_chinese_recite_lower.json'], 
    noExamples: true
},
```

**步骤3：修改首页排序**，把子科目放在对应主科目下方

**步骤4：生成HTML**
```bash
node generate_standalone.js
```

---

## 九、首页排序规范

### 排序规则
1. 主科在前，副科在后
2. 子科目紧跟对应主科目下方
3. 同级别科目按重要性排序

### 当前初二排序
```
1. 数学
2. 物理
3. 英语
4. 英语词汇背诵  ← 英语的子科目
5. 地理
6. 语文
7. 语文重点背诵  ← 语文的子科目
8. 历史
9. 道德与法治
10. 生物
```

---

## 十、UI规范

### 10.1 颜色规范

| 用途 | 颜色类 | 色值 |
|------|--------|------|
| 主色（下册按钮） | primary | #3B82F6 |
| 次色（上册按钮） | secondary | #6366F1 |
| 成功/进度/已学习 | success | #10B981 |
| 错误/错题本 | danger | #EF4444 |
| 警告 | warning | #F97316 |
| 强调 | accent | #F59E0B |

### 10.2 页面元素规范

- 上册按钮在左（紫色 secondary），下册按钮在右（蓝色 primary）
- 知识点卡片支持展开/收起，展开图标为 −，收起为 +
- 搜索框支持按名称/章节过滤
- 已学习知识点：左侧绿色边框 + 标题旁"✓ 已学习"标签 + 淡绿色背景
- 进度条：灰色底 + 绿色填充，高度6px，圆角9999px

### 10.3 响应式

- 桌面端：3列布局
- 移动端（<768px）：单列布局，内边距减小

---

## 十一、核心代码说明

### 11.1 ProgressManager（学习进度管理器）

定义位置：知识点页面 `<script>` 内

| 方法 | 说明 |
|------|------|
| `getProgress()` | 获取全部进度数据 |
| `saveProgress(progress)` | 保存进度数据 |
| `recordStudy(grade, subject, subjectName, semester, semesterName, knowledgeId, knowledgeName)` | 记录学习 |
| `isLearned(knowledgeId)` | 检查知识点是否已学习 |
| `getLastStudy()` | 获取最后学习记录 |
| `getSubjectProgress(grade, subject)` | 获取指定科目进度 |
| `clearSubjectProgress(grade, subject)` | 清除指定科目的学习进度（仅清除该科目） |

### 11.2 WrongBookManager（错题本管理器）

定义位置：知识点页面 和 首页 `<script>` 内

| 方法 | 说明 |
|------|------|
| `getWrongBook(grade, subject)` | 获取指定科目错题 |
| `addWrongBook(item)` | 添加错题 |
| `getAllWrongBookKeys()` | 获取所有科目错题（首页用） |

### 11.3 生成脚本关键函数

| 函数 | 说明 |
|------|------|
| `loadKnowledgeByFiles(files)` | 加载知识点文件，自动添加 semester 字段 |
| `loadExamplesByKnowledge(knowledge)` | 根据知识点加载对应例题 |

---

## 十二、注意事项

### 12.1 JSON格式
- **不要使用英文双引号**包裹文本内容，改用中文引号「」或单引号
- 用 `\n` 表示换行
- 确保所有字符串正确转义
- 新增知识点后务必用 `JSON.parse` 验证格式

### 12.2 性能
- 单个HTML文件建议控制在300KB以内
- 科目较多时，按科目拆分独立页面
- 背诵类内容可以关闭例题功能（noExamples: true）
- 例题数量多的科目（如历史）注意控制文件大小

### 12.3 常见问题

**问题：数学、物理知识点展开后为空**
- 原因：ID格式不带 u/l，导致学期筛选失效
- 解决：在 `loadKnowledgeByFiles` 中根据文件索引自动添加 `semester` 字段，筛选时直接用 `k.semester`

**问题：换一题后展开答案按钮消失**
- 原因：`nextExample()` 只隐藏了答案区域，没有重新显示按钮
- 解决：换题后调用 `document.getElementById('btn-show-answer').classList.remove('hidden')`

**问题：本地文件打不开JSON**
- 原因：浏览器CORS安全策略禁止本地文件 fetch
- 解决：所有数据内嵌到HTML中，通过 `DATA_KNOWLEDGE` 和 `DATA_EXAMPLES` 常量访问

### 12.4 开发流程

1. 修改 `generate_standalone.js`
2. 运行 `node generate_standalone.js`
3. 验证生成的HTML文件
4. 测试功能是否正常

---

## 十三、生成命令

```bash
# 生成所有HTML页面
node generate_standalone.js

# 验证JSON格式
node -e "JSON.parse(require('fs').readFileSync('data/knowledge/xxx.json','utf8')); console.log('OK')"

# 批量验证所有知识点文件
node -e "
const fs = require('fs');
const path = require('path');
const dir = 'data/knowledge';
fs.readdirSync(dir).forEach(f => {
    try {
        JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        console.log('OK:', f);
    } catch(e) {
        console.error('ERROR:', f, e.message);
    }
});
"
```

---

## 十四、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | - | 初始版本，单页面内嵌所有科目数据 |
| v2.0 | - | 按科目拆分独立HTML页面，提升性能 |
| v3.0 | 2026-06-23 | 新增学习进度记录功能 + 语文重点背诵 + 英语词汇背诵 |
