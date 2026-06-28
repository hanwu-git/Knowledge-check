# 初中知识点背诵系统 - 开发文档

## 一、项目概述

本项目是一个**纯前端静态网站**，用于初中知识点背诵和练习。

### 核心特点
- 无需HTTP服务器，双击HTML即可运行
- 数据内嵌到HTML中（解决CORS本地文件访问限制）
- 支持知识点展开/收起、搜索定位
- 支持错题本功能（localStorage持久化）
- 支持学习进度记录（localStorage持久化）
- 按年级+科目拆分独立HTML页面，优化加载性能

### 技术栈
- 纯 HTML + CSS + JavaScript（ES6+）
- Tailwind CSS（CDN引入）
- localStorage（本地数据持久化）
- Node.js（生成脚本）

---

## 二、项目文件结构

### 2.1 根目录结构

```
学生复习/
├── index.html                    # 导航首页（总入口）
├── 404.html                      # 404错误页面
├── wrongbook.html                # 错题本页面
├── grade1_index.html             # 初一专用首页（备用）
│
├── knowledge_g1_*.html           # 初一各科目页面（10个）
│   ├── knowledge_g1_math.html
│   ├── knowledge_g1_english.html
│   ├── knowledge_g1_english_vocab.html
│   ├── knowledge_g1_chinese.html
│   ├── knowledge_g1_chinese_recite.html
│   ├── knowledge_g1_history.html
│   ├── knowledge_g1_geography.html
│   ├── knowledge_g1_biology.html
│   └── knowledge_g1_daofa.html
│
├── knowledge_g2_*.html           # 初二各科目页面（10个）
│   ├── knowledge_g2_math.html
│   ├── knowledge_g2_physics.html
│   ├── knowledge_g2_english.html
│   ├── knowledge_g2_english_vocab.html
│   ├── knowledge_g2_chinese.html
│   ├── knowledge_g2_chinese_recite.html
│   ├── knowledge_g2_history.html
│   ├── knowledge_g2_geography.html
│   ├── knowledge_g2_biology.html
│   └── knowledge_g2_daofa.html
│
├── css/
│   └── styles.css                # 共享样式
│
├── data/
│   ├── knowledge/                # 知识点源文件（按年级+科目+学期）
│   └── examples/                 # 例题源文件（两种格式并存）
│
├── scripts/                      # 开发脚本（不部署）
│   ├── generate_standalone.js    # ★核心生成脚本★
│   ├── generate_*.js             # 各科目例题生成脚本
│   ├── verify_*.js               # 质量校验脚本
│   └── data/                     # 生成脚本的分段数据
│
├── version.json                  # 版本信息
├── .gitignore                    # Git忽略配置
├── DEVELOPMENT.md                # 本文档
└── README.md
```

> **重要警告**：根目录下的 `knowledge_*.html`（不带年级前缀，如 `knowledge_math.html`）是**旧文件**，不要再使用。所有有效页面都带年级前缀：`knowledge_g1_*.html`、`knowledge_g2_*.html`。

### 2.2 知识点文件（data/knowledge/）

**命名格式**：`g{年级}_{科目}_{学期}.json`

| 部分 | 说明 | 可选值 |
|------|------|--------|
| 年级 | g1=初一，g2=初二，g3=初三 | g1, g2, g3 |
| 科目 | 科目英文标识 | math, physics, english, geography, chinese, history, daofa, biology, chinese_recite, english_vocab |
| 学期 | upper=上册，lower=下册 | upper, lower |

**当前文件列表**：

| 年级 | 科目 | 上册 | 下册 |
|------|------|------|------|
| 初一 | 数学 | g1_math_upper.json | g1_math_lower.json |
| 初一 | 英语 | g1_english_upper.json | g1_english_lower.json |
| 初一 | 英语词汇 | g1_english_vocab_upper.json | g1_english_vocab_lower.json |
| 初一 | 语文 | g1_chinese_upper.json | g1_chinese_lower.json |
| 初一 | 语文背诵 | g1_chinese_recite_upper.json | g1_chinese_recite_lower.json |
| 初一 | 历史 | g1_history_upper.json | g1_history_lower.json |
| 初一 | 地理 | g1_geography_upper.json | g1_geography_lower.json |
| 初一 | 生物 | g1_biology_upper.json | g1_biology_lower.json |
| 初一 | 道法 | g1_daofa_upper.json | g1_daofa_lower.json |
| 初二 | 数学 | g2_math_upper.json | g2_math_lower.json |
| 初二 | 物理 | g2_physics_upper.json | g2_physics_lower.json |
| 初二 | 英语 | g2_english_upper.json | g2_english_lower.json |
| 初二 | 英语词汇 | g2_english_vocab_upper.json | g2_english_vocab_lower.json |
| 初二 | 语文 | g2_chinese_upper.json | g2_chinese_lower.json |
| 初二 | 语文背诵 | g2_chinese_recite_upper.json | g2_chinese_recite_lower.json |
| 初二 | 历史 | g2_history_upper.json | g2_history_lower.json |
| 初二 | 地理 | g2_geography_upper.json | g2_geography_lower.json |
| 初二 | 生物 | g2_biology_upper.json | g2_biology_lower.json |
| 初二 | 道法 | g2_daofa_upper.json | g2_daofa_lower.json |

### 2.3 例题文件（data/examples/）

例题文件有**两种格式**，生成脚本会自动识别：

#### 格式A：单独文件格式（推荐）
每个知识点一个文件，命名格式：`g{年级}_{科目}_{学期编号}{序号}_010.json`

| 部分 | 说明 |
|------|------|
| 学期编号 | u=上册，l=下册 |
| 序号 | 3位数字，从001开始 |
| _010 | 固定后缀，表示10道题 |

**示例**：
```
g2_chinese_u001_010.json     初二语文上册第1个知识点（10道题）
g2_english_l015_010.json     初二英语下册第15个知识点（10道题）
```

#### 格式B：汇总文件格式（兼容旧数据）
所有例题在一个文件中，命名格式：`g{年级}_{科目}_quality.json` 或 `g{年级}_{科目}_{学期}_quality.json`

**示例**：
```
g1_math_quality.json          初一数学全部例题（汇总）
g2_physics_upper_quality.json 初二物理上册例题（汇总）
g2_physics_lower_quality.json 初二物理下册例题（汇总）
```

#### 当前各科目例题格式

| 年级 | 科目 | 文件格式 | 文件数 | 例题数 |
|------|------|----------|--------|--------|
| 初一 | 数学 | 汇总 | 1 | 300 |
| 初一 | 英语 | 汇总 | 1 | 600 |
| 初一 | 语文 | 汇总 | 1 | 600 |
| 初一 | 历史 | 汇总 | 1 | 600 |
| 初一 | 地理 | 汇总 | 1 | 200 |
| 初一 | 生物 | 汇总 | 1 | 198 |
| 初一 | 道法 | 汇总 | 1 | 600 |
| 初二 | 数学 | 单独+汇总 | 54 | 530 |
| 初二 | 物理 | 汇总 | 2 | 570 |
| 初二 | 英语 | 单独 | 87 | 870 |
| 初二 | 语文 | 单独 | 60 | 600 |
| 初二 | 语文背诵 | 单独 | 30 | 300 |
| 初二 | 历史 | 单独 | 92 | 920 |
| 初二 | 地理 | 单独 | 85 | 850 |
| 初二 | 生物 | 汇总 | 1 | 660 |
| 初二 | 道法 | 单独 | 60 | 600 |

> **生成脚本加载逻辑**：优先检测是否有单独文件（`g{年级}_{科目}_\d+_\d+.json`），有则只用单独文件；没有则用汇总文件。避免重复加载导致题目重复。

---

## 三、HTML页面命名规范（重要！）

### 3.1 页面命名规则

**所有科目页面必须带年级前缀**：

```
knowledge_{年级}_{科目}.html
```

| 年级 | 前缀 | 示例 |
|------|------|------|
| 初一 | g1_ | knowledge_g1_math.html |
| 初二 | g2_ | knowledge_g2_physics.html |
| 初三 | g3_ | knowledge_g3_chemistry.html |

### 3.2 首页链接规则

首页 index.html 中的链接**必须包含年级前缀**：

```html
<!-- 初一数学（正确） -->
<a href="knowledge_g1_math.html?semester=upper">上册</a>

<!-- 初二数学（正确） -->
<a href="knowledge_g2_math.html?semester=upper">上册</a>

<!-- 错误示例（缺少年级前缀） -->
<a href="knowledge_math.html?semester=upper">上册</a>  <!-- ❌ 错误！ -->
```

### 3.3 "继续学习"按钮链接规则

首页"继续学习"功能的链接生成**必须包含年级前缀**：

```javascript
// 正确写法
const url = 'knowledge_' + lastStudy.grade + '_' + lastStudy.subject + '.html?semester=' + lastStudy.semester + '#' + lastStudy.knowledgeId;

// 错误写法（缺少年级）
const url = 'knowledge_' + lastStudy.subject + '.html?semester=' + lastStudy.semester + '#' + lastStudy.knowledgeId; // ❌ 错误！
```

---

## 四、生成脚本规范（generate_standalone.js）

### 4.1 脚本位置
`scripts/generate_standalone.js` —— 唯一的页面生成脚本

### 4.2 年级配置结构

```javascript
const grades = {
    grade1: {
        name: '初一',
        shortName: '七',
        prefix: 'g1_',
        subjects: {
            math: { name: '数学', color: 'blue', files: ['g1_math_upper.json', 'g1_math_lower.json'] },
            // ...
        }
    },
    grade2: {
        name: '初二',
        shortName: '八',
        prefix: 'g2_',
        subjects: {
            math: { name: '数学', color: 'blue', files: ['g2_math_upper.json', 'g2_math_lower.json'] },
            physics: { name: '物理', color: 'purple', files: ['g2_physics_upper.json', 'g2_physics_lower.json'] },
            // ...
        }
    }
};
```

### 4.3 科目配置项

| 配置项 | 说明 | 必填 |
|--------|------|------|
| name | 科目显示名称 | 是 |
| color | 主题色（blue/purple/green/yellow/red/orange/pink/teal） | 是 |
| files | 知识点文件数组 [上册, 下册] | 是 |
| noExamples | true=不加载例题，不显示例题按钮 | 否 |
| icon | 科目图标 emoji | 否 |

### 4.4 页面文件名生成规则

生成脚本中的页面文件名**必须包含年级前缀**：

```javascript
// 正确：knowledge_g2_math.html
const fileName = `knowledge_${gradeKey.replace('grade', 'g')}_${subjKey}.html`;

// 或者：从 grade.prefix + subjectKey 组合
const fileName = `knowledge_${grade.prefix}${subjectKey}.html`;
```

### 4.5 例题加载逻辑

```javascript
function loadExamplesBySubject(gradePrefix, subjectKey) {
    const examples = [];
    const allFiles = fs.readdirSync(examplesDir).filter(f => 
        f.startsWith(`${gradePrefix}${subjectKey}_`) && f.endsWith('.json')
    );
    
    // 检查是否有单独的例题文件（格式：g2_math_001_010.json）
    const individualPattern = new RegExp(`^${gradePrefix}${subjectKey}_\\d+_\\d+\\.json$`);
    const individualFiles = allFiles.filter(f => individualPattern.test(f));
    
    let filesToLoad = [];
    if (individualFiles.length > 0) {
        // 有单独文件，优先使用单独文件（排除汇总文件，避免重复）
        filesToLoad = individualFiles;
    } else {
        // 没有单独文件，使用所有匹配的文件（包括 quality 汇总文件）
        filesToLoad = allFiles;
    }
    // ...
}
```

---

## 五、数据格式规范

### 5.1 知识点格式

```json
[
  {
    "id": "g2_math_027",
    "chapter": "第十一章 三角形",
    "name": "三角形的概念与分类",
    "formula": "三角形内角和 = 180°",
    "explanation": "由不在同一直线上的三条线段首尾顺次相接所组成的图形叫做三角形。\n\n分类：...",
    "semester": "upper"
  }
]
```

| 字段 | 说明 |
|------|------|
| id | 唯一标识，格式见下方 |
| chapter | 章节名称 |
| name | 知识点名称 |
| formula | 主要内容（公式、定义等） |
| explanation | 详细解释，用 \n 换行 |
| semester | 学期标记（upper/lower），由生成脚本自动添加 |

### 5.2 知识点ID格式

目前有两种格式（历史原因）：

**格式1（数学、物理旧格式）**：
```
g{年级}_{科目}_{序号}
```
示例：`g2_math_027`（序号连续编号，不分上下册）

**格式2（其他科目新格式）**：
```
g{年级}_{科目}_{学期编号}{序号}
```
示例：`g2_chinese_u001`（u=上册，l=下册，序号按册独立）

### 5.3 例题格式

```json
[
  {
    "id": "g2_math_001_ex01",
    "knowledge_id": "g2_math_001",
    "question": "选择题：下列式子中，属于二次根式的是（  ）\nA. √(-3)\nB. √4\nC. ³√8\nD. 2",
    "answer": "答案：B\n解析：\nA. √(-3)不是二次根式..."
  }
]
```

| 字段 | 说明 |
|------|------|
| id | 例题唯一标识：知识点ID + _ex + 两位序号 |
| knowledge_id | 对应知识点的ID |
| question | 题目内容（选择题选项用 \n 换行） |
| answer | 答案和解析 |

### 5.4 学习进度数据（localStorage）

**Key**: `study_progress`

```javascript
{
  lastStudy: {
    grade: 'g2',
    subject: 'math',
    subjectName: '数学',
    semester: 'upper',
    semesterName: '上册',
    knowledgeId: 'g2_math_027',
    knowledgeName: '三角形的概念与分类',
    timestamp: '2026-06-27T10:30:00.000Z'
  },
  learnedKnowledge: {
    'g2_math_027': { learnedAt: '2026-06-27T10:30:00.000Z' },
    'g2_math_028': { learnedAt: '2026-06-27T10:35:00.000Z' }
  },
  dailyStats: {
    '2026-06-27': { learnedCount: 5, subjects: ['math', 'physics'] }
  }
}
```

### 5.5 错题本数据（localStorage）

**Key 前缀**: `wrongbook_{grade}_{subject}`

```javascript
[
  {
    id: 'g2_math_027_1687456789000',
    knowledgeId: 'g2_math_027',
    knowledgeName: '三角形的概念与分类',
    grade: 'g2',
    subject: 'math',
    question: '题目内容...',
    answer: '答案及解析...',
    addedAt: '2026-06-27T10:30:00.000Z'
  }
]
```

---

## 六、功能模块

### 6.1 首页 (index.html)

| 功能 | 说明 |
|------|------|
| 年级/科目导航 | 按年级分组展示科目入口 |
| 继续学习卡片 | 显示上次学习记录，一键继续 |
| 科目进度条 | 每个科目显示学习进度（已学/总数） |
| 错题本入口 | 跳转到错题本页面，显示错题数量 |
| 数据统计 | 展示总知识点、总例题、总错题数 |
| 使用说明 | 三步使用指南 |

### 6.2 知识点页面 (knowledge_g{年级}_{科目}.html)

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

### 6.3 错题本 (wrongbook.html)

| 功能 | 说明 |
|------|------|
| 错题列表 | 按科目分组展示所有错题 |
| 删除错题 | 移除已掌握的错题 |
| 清空错题 | 一键清空所有错题 |
| 本地存储 | 数据保存在 localStorage |

---

## 七、各科目知识点数量

### 7.1 初一

| 科目 | 上册 | 下册 | 合计 | 例题数 |
|------|------|------|------|--------|
| 数学 | 30 | 30 | 60 | 300 |
| 英语 | 30 | 30 | 60 | 600 |
| 英语词汇背诵 | 15 | 15 | 30 | 0 |
| 语文 | 30 | 30 | 60 | 600 |
| 语文重点背诵 | 15 | 15 | 30 | 0 |
| 历史 | 30 | 30 | 60 | 600 |
| 地理 | 30 | 30 | 60 | 200 |
| 生物 | 30 | 30 | 60 | 198 |
| 道德与法治 | 30 | 30 | 60 | 600 |
| **合计** | **240** | **240** | **480** | **3098** |

### 7.2 初二

| 科目 | 上册 | 下册 | 合计 | 例题数 |
|------|------|------|------|--------|
| 数学 | 27 | 26 | 53 | 530 |
| 物理 | 28 | 30 | 58 | 570 |
| 英语 | 43 | 42 | 85 | 870 |
| 英语词汇背诵 | 15 | 15 | 30 | 0 |
| 语文 | 30 | 30 | 60 | 600 |
| 语文重点背诵 | 15 | 15 | 30 | 0 |
| 历史 | 46 | 46 | 92 | 920 |
| 地理 | 50 | 35 | 85 | 850 |
| 生物 | 33 | 33 | 66 | 660 |
| 道德与法治 | 30 | 30 | 60 | 600 |
| **合计** | **297** | **262** | **621** | **5600** |

---

## 八、开发检查清单（必填！）

每次修改生成脚本或数据后，**必须逐项检查**：

### 8.1 页面生成检查

- [ ] 运行 `node scripts/generate_standalone.js` 无报错
- [ ] 生成的HTML文件名带年级前缀（`knowledge_g1_*`、`knowledge_g2_*`）
- [ ] 首页所有科目链接带年级前缀（`href="knowledge_g2_math.html"`）
- [ ] "继续学习"按钮的链接生成包含年级（`lastStudy.grade`）
- [ ] 没有生成不带年级前缀的旧格式页面（`knowledge_math.html` 等）

### 8.2 数据完整性检查

- [ ] 知识点数量与配置一致（上册数 + 下册数 = 总数）
- [ ] 例题数量 = 知识点数 × 10（无例题的科目除外）
- [ ] 例题没有重复加载（通过 unique ID 检查）
- [ ] 每个知识点都有对应的例题（或明确配置 noExamples）
- [ ] 例题ID与知识点ID对应正确

### 8.3 质量检查

- [ ] 例题不是模板化内容（不含"完全错误的说法"、"关键点："等）
- [ ] 选择题选项不重复
- [ ] 题目中不包含答案（答案只在 answer 字段）
- [ ] 运行 `scripts/verify_all_examples.js` 全量校验通过

### 8.4 功能验证

- [ ] 首页点击各科目链接能正确跳转
- [ ] 上册/下册切换正常
- [ ] 知识点展开/收起正常
- [ ] 例题按钮能弹出题目
- [ ] "换一题"功能正常
- [ ] "展示答案"按钮正常
- [ ] "加入错题本"功能正常
- [ ] 学习进度记录正常
- [ ] "继续学习"能跳转到正确页面

### 8.5 快速验证命令

```bash
# 生成页面
node scripts/generate_standalone.js

# 验证例题质量
node scripts/verify_all_examples.js

# 检查某科目页面的例题数量
node -e "
const fs = require('fs');
const html = fs.readFileSync('knowledge_g2_math.html', 'utf8');
const match = html.match(/const DATA_EXAMPLES = (\[[\s\S]*?\]);/);
const examples = JSON.parse(match[1]);
const uniqueIds = [...new Set(examples.map(e => e.id))];
console.log('总例题数:', examples.length);
console.log('去重后:', uniqueIds.length);
console.log('知识点数:', [...new Set(examples.map(e => e.knowledge_id))].length);
"
```

---

## 九、常见错误与避坑指南

### ❌ 错误1：首页链接缺少年级前缀

**现象**：从首页点击初二数学，进入的页面例题不全或数据不对。

**原因**：生成首页链接时写成了 `knowledge_math.html`，漏掉了 `g2_` 前缀。

**错误代码**：
```javascript
// ❌ 错误
<a href="knowledge_${key}.html?semester=upper">上册</a>
```

**正确代码**：
```javascript
// ✅ 正确（初二）
<a href="knowledge_g2_${key}.html?semester=upper">上册</a>

// ✅ 正确（通用，用 gradeKey）
<a href="knowledge_${gradeKey.replace('grade', 'g')}_${key}.html?semester=upper">上册</a>
```

**教训**：
- 所有科目页面文件名必须带年级前缀
- 初一页面：`knowledge_g1_*.html`
- 初二页面：`knowledge_g2_*.html`
- 不要使用不带前缀的文件名（如 `knowledge_math.html`）

---

### ❌ 错误2："继续学习"链接缺少年级前缀

**现象**：点击首页"继续学习"按钮，跳转到错误页面或404。

**原因**：生成链接时只使用了 `lastStudy.subject`，没有加上 `lastStudy.grade`。

**错误代码**：
```javascript
// ❌ 错误
const url = 'knowledge_' + lastStudy.subject + '.html?semester=' + lastStudy.semester;
```

**正确代码**：
```javascript
// ✅ 正确
const url = 'knowledge_' + lastStudy.grade + '_' + lastStudy.subject + '.html?semester=' + lastStudy.semester;
```

---

### ❌ 错误3：例题重复加载

**现象**：每个知识点有20道题（实际应该10道），"换一题"时经常遇到重复。

**原因**：同时加载了单独例题文件和汇总文件（quality文件），导致数据重复。

**错误代码**：
```javascript
// ❌ 错误：所有匹配文件都加载
const files = fs.readdirSync(examplesDir).filter(f => 
    f.startsWith(`${gradePrefix}${subjectKey}_`) && f.endsWith('.json')
);
```

**正确代码**：
```javascript
// ✅ 正确：有单独文件时优先用单独文件，避免重复
const individualPattern = new RegExp(`^${gradePrefix}${subjectKey}_\\d+_\\d+\\.json$`);
const individualFiles = allFiles.filter(f => individualPattern.test(f));

let filesToLoad = [];
if (individualFiles.length > 0) {
    filesToLoad = individualFiles;  // 只用单独文件
} else {
    filesToLoad = allFiles;         // 没有单独文件才用汇总文件
}
```

**教训**：
- 例题文件有两种格式：单独文件（推荐）和汇总文件（兼容旧数据）
- 加载时优先检测并使用单独文件
- 不要两种文件同时加载

---

### ❌ 错误4：例题质量低下（模板化）

**现象**：题目选项是"完全错误的说法"、"关键点："、"与知识点无关的说法"等无意义内容。

**原因**：使用了早期的自动生成脚本，生成的题目是模板化的占位内容。

**检查方法**：
```bash
node scripts/verify_all_examples.js
```

**修复方法**：使用高质量生成脚本重新生成，或手动修改。

---

### ❌ 错误5：答案出现在题目中

**现象**：题目里直接包含"答案：X"或"解析："内容，等于提前泄题。

**原因**：生成例题时把答案也写到了 question 字段里。

**检查方法**：
```bash
node scripts/check_answer_in_question.js
```

---

### ❌ 错误6：学期筛选失效

**现象**：切换上册/下册时，知识点列表没有变化。

**原因**：知识点ID格式不统一，有的带 u/l 学期前缀，有的不带，导致筛选逻辑出错。

**解决**：统一使用 `semester` 字段进行筛选，不依赖ID格式。生成脚本在加载知识点时自动添加 `semester` 字段。

---

## 十、新增年级/科目步骤

### 10.1 新增一个年级（如初三）

**步骤1：创建知识点文件**
```
data/knowledge/g3_math_upper.json
data/knowledge/g3_math_lower.json
data/knowledge/g3_physics_upper.json
data/knowledge/g3_physics_lower.json
data/knowledge/g3_chemistry_upper.json
...
```

**步骤2：创建例题文件**（二选一）
- 推荐：为每个知识点创建单独文件
  ```
  data/examples/g3_math_u001_010.json
  data/examples/g3_math_u002_010.json
  ...
  ```
- 或创建汇总文件
  ```
  data/examples/g3_math_quality.json
  ```

**步骤3：修改 generate_standalone.js**

在 `grades` 对象中添加新年级配置：
```javascript
const grades = {
    grade1: { /* ... */ },
    grade2: { /* ... */ },
    grade3: {
        name: '初三',
        shortName: '九',
        prefix: 'g3_',
        subjects: {
            math: { name: '数学', color: 'blue', files: ['g3_math_upper.json', 'g3_math_lower.json'] },
            physics: { name: '物理', color: 'purple', files: ['g3_physics_upper.json', 'g3_physics_lower.json'] },
            chemistry: { name: '化学', color: 'teal', files: ['g3_chemistry_upper.json', 'g3_chemistry_lower.json'] },
            // ...
        }
    }
};
```

**步骤4：生成HTML**
```bash
node scripts/generate_standalone.js
```

**步骤5：按检查清单验证**
- 页面文件名带年级前缀
- 首页链接正确
- 例题数量正确
- 功能正常

### 10.2 新增一个科目（如物理）

参考上面的步骤，在对应年级的 `subjects` 中添加配置即可。

### 10.3 新增背诵类子科目（无例题）

**步骤1：创建知识点文件**
```
data/knowledge/g2_english_vocab_upper.json
data/knowledge/g2_english_vocab_lower.json
```

**步骤2：修改 generate_standalone.js**
```javascript
english_vocab: { 
    name: '英语词汇背诵', 
    color: 'green', 
    files: ['g2_english_vocab_upper.json', 'g2_english_vocab_lower.json'], 
    noExamples: true   // 关键：不显示例题
},
```

**步骤3：调整首页排序**，把子科目放在对应主科目下方

**步骤4：生成并验证**
```bash
node scripts/generate_standalone.js
```

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
| `clearSubjectProgress(grade, subject)` | 清除指定科目的学习进度 |

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
| `loadExamplesBySubject(gradePrefix, subjectKey)` | 加载例题，自动识别单独/汇总格式 |

---

## 十二、UI规范

### 12.1 颜色规范

| 用途 | 颜色类 | 色值 |
|------|--------|------|
| 主色（下册按钮） | primary | #3B82F6 |
| 次色（上册按钮） | secondary | #6366F1 |
| 成功/进度/已学习 | success | #10B981 |
| 错误/错题本 | danger | #EF4444 |
| 警告 | warning | #F97316 |
| 强调 | accent | #F59E0B |

### 12.2 页面元素规范

- 上册按钮在左（紫色 secondary），下册按钮在右（蓝色 primary）
- 知识点卡片支持展开/收起，展开图标为 −，收起为 +
- 搜索框支持按名称/章节过滤
- 已学习知识点：左侧绿色边框 + 标题旁"✓ 已学习"标签
- 进度条：灰色底 + 绿色填充，高度6px，圆角9999px

---

## 十三、开发流程

### 标准流程

1. 修改 `scripts/generate_standalone.js` 或数据文件
2. 运行生成脚本：`node scripts/generate_standalone.js`
3. 按**第八章 开发检查清单**逐项验证
4. 运行质量校验：`node scripts/verify_all_examples.js`
5. 手动测试关键功能（跳转、例题、进度）
6. 提交代码并推送

### 快速验证

```bash
# 1. 生成
node scripts/generate_standalone.js

# 2. 检查例题数量和重复
node -e "
const fs = require('fs');
const files = ['knowledge_g2_math.html', 'knowledge_g2_physics.html'];
files.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    const match = html.match(/const DATA_EXAMPLES = (\[[\s\S]*?\]);/);
    if (match) {
        const ex = JSON.parse(match[1]);
        const unique = [...new Set(ex.map(e => e.id))];
        const kps = [...new Set(ex.map(e => e.knowledge_id))];
        console.log(file + ': ' + ex.length + '题, ' + unique.length + '唯一, ' + kps.length + '知识点');
    }
});
"

# 3. 质量检查
node scripts/verify_all_examples.js
```

---

## 十四、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | - | 初始版本，单页面内嵌所有科目数据 |
| v2.0 | - | 按科目拆分独立HTML页面，提升性能 |
| v3.0 | 2026-06-23 | 新增学习进度记录 + 语文重点背诵 + 英语词汇背诵 |
| v1.0.4 | 2026-06-27 | 修复初二链接缺少年级前缀Bug + 修复例题重复加载Bug |
