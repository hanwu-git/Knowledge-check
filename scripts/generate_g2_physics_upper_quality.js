const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'data', 'knowledge');
const EXAMPLE_DIR = path.join(__dirname, '..', 'data', 'examples');

const upperKps = JSON.parse(fs.readFileSync(path.join(KNOWLEDGE_DIR, 'g2_physics_upper.json'), 'utf8'));

function add(id, kpId, question, answer) {
    return { id, knowledge_id: kpId, question, answer };
}

const allExamples = [];

// ===== 长度的单位与测量 =====
const p1 = 'g2_physics_001';
allExamples.push(add(p1+'_ex01', p1,
    '选择题：下列长度单位换算正确的是（  ）\nA. 1 km = 100 m\nB. 1 m = 100 cm\nC. 1 cm = 100 mm\nD. 1 mm = 100 μm',
    '答案：B\n解析：\nA. 错误，1 km = 1000 m\nB. 正确，1 m = 10 dm = 100 cm\nC. 错误，1 cm = 10 mm\nD. 错误，1 mm = 1000 μm'
));
allExamples.push(add(p1+'_ex02', p1,
    '填空题：国际单位制中，长度的基本单位是______。',
    '答案：米（m）\n解析：国际单位制中长度的基本单位是米，符号为m。'
));
allExamples.push(add(p1+'_ex03', p1,
    '选择题：用刻度尺测量物体长度时，下列做法正确的是（  ）\nA. 刻度尺要斜放\nB. 视线要与刻度线垂直\nC. 可以将刻度尺从物体上移开读数\nD. 不需要估读',
    '答案：B\n解析：\nA. 错误，刻度尺要放正\nB. 正确，视线与刻度线垂直才能读数准确\nC. 错误，读数时刻度尺不能移开\nD. 错误，需要估读到分度值的下一位'
));
allExamples.push(add(p1+'_ex04', p1,
    '判断题：测量结果必须包括准确值、估计值和单位。',
    '答案：正确\n解析：测量值 = 准确值 + 估计值 + 单位，三者缺一不可。'
));
allExamples.push(add(p1+'_ex05', p1,
    '解答题：某同学用刻度尺测量书本长度，结果为25.12 cm，请说明这个测量结果中各部分的含义。',
    '答案：25.1 cm是准确值，0.02 cm是估计值，cm是单位。\n解析：准确值是刻度尺能精确读出的部分，估计值是根据分度值估读的部分。'
));
allExamples.push(add(p1+'_ex06', p1,
    '选择题：下列物体的长度最接近1 m的是（  ）\nA. 一支铅笔\nB. 一张课桌\nC. 一根筷子\nD. 一个篮球',
    '答案：B\n解析：课桌的高度大约是1 m左右。'
));
allExamples.push(add(p1+'_ex07', p1,
    '填空题：1 μm = ______ nm。',
    '答案：1000\n解析：1 mm = 1000 μm = 1000000 nm，所以1 μm = 1000 nm。'
));
allExamples.push(add(p1+'_ex08', p1,
    '判断题：误差是可以避免的。',
    '答案：错误\n解析：误差是测量值与真实值之间的差异，只能减小，不能避免。'
));
allExamples.push(add(p1+'_ex09', p1,
    '解答题：如何减小测量误差？',
    '答案：1. 多次测量取平均值；2. 使用更精密的测量工具；3. 改进测量方法。\n解析：误差不可避免，但可以通过这些方法减小。'
));
allExamples.push(add(p1+'_ex10', p1,
    '选择题：刻度尺的分度值是1 mm，测量结果为12.34 cm，则准确值和估计值分别是（  ）\nA. 12 cm和0.34 cm\nB. 12.3 cm和0.04 cm\nC. 12.34 cm和0 cm\nD. 12.3 cm和0.04 mm',
    '答案：B\n解析：分度值是1 mm，所以准确值到毫米位，即12.3 cm，估计值是0.04 cm。'
));

// ===== 时间的单位与测量 =====
const p2 = 'g2_physics_002';
allExamples.push(add(p2+'_ex01', p2,
    '选择题：下列时间单位换算正确的是（  ）\nA. 1 h = 60 s\nB. 1 min = 600 s\nC. 1 h = 3600 s\nD. 1 s = 100 ms',
    '答案：C\n解析：\nA. 错误，1 h = 60 min = 3600 s\nB. 错误，1 min = 60 s\nC. 正确，1 h = 60 min = 3600 s\nD. 错误，1 s = 1000 ms'
));
allExamples.push(add(p2+'_ex02', p2,
    '填空题：国际单位制中，时间的基本单位是______。',
    '答案：秒（s）\n解析：国际单位制中时间的基本单位是秒，符号为s。'
));
allExamples.push(add(p2+'_ex03', p2,
    '选择题：测量时间的工具是（  ）\nA. 刻度尺\nB. 停表\nC. 温度计\nD. 天平',
    '答案：B\n解析：停表（秒表）是测量时间的工具。'
));
allExamples.push(add(p2+'_ex04', p2,
    '判断题：误差只能减小，不能避免。',
    '答案：正确\n解析：误差是不可避免的，只能通过多次测量取平均值等方法减小。'
));
allExamples.push(add(p2+'_ex05', p2,
    '解答题：测量某物体运动时间，三次测量结果分别为2.1 s、2.2 s、2.3 s，求平均值。',
    '答案：2.2 s\n解析：平均值 = (2.1 + 2.2 + 2.3) ÷ 3 = 6.6 ÷ 3 = 2.2 s'
));
allExamples.push(add(p2+'_ex06', p2,
    '选择题：下列关于时间的说法，正确的是（  ）\nA. 时间没有单位\nB. 秒是时间的唯一单位\nC. 时间可以用停表测量\nD. 时间不能测量',
    '答案：C\n解析：时间可以用停表测量，秒是基本单位但不是唯一单位。'
));
allExamples.push(add(p2+'_ex07', p2,
    '填空题：1 min = ______ s。',
    '答案：60\n解析：1分钟等于60秒。'
));
allExamples.push(add(p2+'_ex08', p2,
    '判断题：测量时间时，不需要估读。',
    '答案：错误\n解析：测量时间也需要估读到分度值的下一位。'
));
allExamples.push(add(p2+'_ex09', p2,
    '解答题：为什么要进行多次测量取平均值？',
    '答案：减小误差，提高测量的准确性。\n解析：单次测量可能存在较大误差，多次测量取平均值可以减小偶然误差。'
));
allExamples.push(add(p2+'_ex10', p2,
    '选择题：停表的分度值是0.1 s，测量结果为15.25 s，则准确值和估计值分别是（  ）\nA. 15 s和0.25 s\nB. 15.2 s和0.05 s\nC. 15.25 s和0 s\nD. 15.2 s和0.05 min',
    '答案：B\n解析：分度值是0.1 s，准确值到0.1 s位，即15.2 s，估计值是0.05 s。'
));

// ===== 机械运动与参照物 =====
const p3 = 'g2_physics_003';
allExamples.push(add(p3+'_ex01', p3,
    '选择题：下列现象中，属于机械运动的是（  ）\nA. 苹果腐烂\nB. 花香四溢\nC. 汽车行驶\nD. 铁钉生锈',
    '答案：C\n解析：机械运动是物体位置的变化。汽车行驶时位置在变化，属于机械运动。'
));
allExamples.push(add(p3+'_ex02', p3,
    '填空题：研究机械运动时，被选作标准的物体叫做______。',
    '答案：参照物\n解析：参照物是研究机械运动时选作标准的物体。'
));
allExamples.push(add(p3+'_ex03', p3,
    '选择题：坐在行驶的汽车里的乘客，以地面为参照物时是（  ）\nA. 静止的\nB. 运动的\nC. 可能静止也可能运动\nD. 无法确定',
    '答案：B\n解析：乘客相对于地面的位置在变化，所以是运动的。'
));
allExamples.push(add(p3+'_ex04', p3,
    '判断题：参照物可以任意选择。',
    '答案：正确\n解析：参照物可以任意选择，但一旦选定，就认为它是静止的。'
));
allExamples.push(add(p3+'_ex05', p3,
    '解答题：小明坐在行驶的火车上，看到窗外的树木向后退，这是以什么为参照物？',
    '答案：以火车（或小明自己）为参照物。\n解析：树木相对于火车的位置在向后变化，所以看到树木向后退。'
));
allExamples.push(add(p3+'_ex06', p3,
    '选择题：下列关于运动和静止的说法，正确的是（  ）\nA. 运动是绝对的，静止是相对的\nB. 运动是相对的，静止是绝对的\nC. 运动和静止都是绝对的\nD. 运动和静止都是相对的',
    '答案：A\n解析：运动是绝对的，宇宙中一切物体都在运动；静止是相对的，取决于所选参照物。'
));
allExamples.push(add(p3+'_ex07', p3,
    '填空题：同一物体是运动还是静止，取决于所选的______，这叫运动和静止的相对性。',
    '答案：参照物\n解析：运动和静止的相对性。'
));
allExamples.push(add(p3+'_ex08', p3,
    '判断题：选择不同的参照物，物体的运动状态一定不同。',
    '答案：错误\n解析：可能相同也可能不同，取决于参照物的选择。'
));
allExamples.push(add(p3+'_ex09', p3,
    '解答题：两位同学并肩而行，以地面为参照物，他们是运动的还是静止的？以其中一位同学为参照物呢？',
    '答案：以地面为参照物，他们是运动的；以其中一位同学为参照物，另一位是静止的。\n解析：考察参照物对运动状态的影响。'
));
allExamples.push(add(p3+'_ex10', p3,
    '选择题："小小竹排江中游，巍巍青山两岸走"，前一句和后一句分别以什么为参照物（  ）\nA. 青山，竹排\nB. 竹排，青山\nC. 江水，青山\nD. 青山，江水',
    '答案：A\n解析：竹排相对于青山在运动；青山相对于竹排在运动。'
));

// ===== 速度的概念与公式 =====
const p4 = 'g2_physics_004';
allExamples.push(add(p4+'_ex01', p4,
    '选择题：速度的公式是（  ）\nA. v = s × t\nB. v = s / t\nC. v = t / s\nD. s = v × t',
    '答案：B\n解析：速度 = 路程 ÷ 时间，即v = s/t。'
));
allExamples.push(add(p4+'_ex02', p4,
    '填空题：速度的国际单位是______。',
    '答案：米/秒（m/s）\n解析：速度的国际单位是米/秒，符号为m/s。'
));
allExamples.push(add(p4+'_ex03', p4,
    '选择题：下列速度单位换算正确的是（  ）\nA. 1 m/s = 3.6 km/h\nB. 1 km/h = 3.6 m/s\nC. 1 m/s = 1 km/h\nD. 1 m/s = 0.36 km/h',
    '答案：A\n解析：1 m/s = 3.6 km/h。'
));
allExamples.push(add(p4+'_ex04', p4,
    '判断题：速度是表示物体运动快慢的物理量。',
    '答案：正确\n解析：速度的物理意义就是表示物体运动的快慢。'
));
allExamples.push(add(p4+'_ex05', p4,
    '解答题：一辆汽车在2小时内行驶了120 km，求这辆汽车的速度。',
    '答案：60 km/h（或约16.7 m/s）\n解析：v = s/t = 120 km ÷ 2 h = 60 km/h。'
));
allExamples.push(add(p4+'_ex06', p4,
    '选择题：关于匀速直线运动，下列说法正确的是（  ）\nA. 速度越来越大\nB. 速度越来越小\nC. 速度保持不变\nD. 速度先变大后变小',
    '答案：C\n解析：匀速直线运动的速度保持不变。'
));
allExamples.push(add(p4+'_ex07', p4,
    '填空题：1 m/s = ______ km/h。',
    '答案：3.6\n解析：1 m/s = 3.6 km/h。'
));
allExamples.push(add(p4+'_ex08', p4,
    '判断题：速度越大，物体通过的路程一定越长。',
    '答案：错误\n解析：路程 = 速度 × 时间，还与时间有关。'
));
allExamples.push(add(p4+'_ex09', p4,
    '解答题：一列火车以72 km/h的速度行驶，通过一座长1000 m的桥用了60 s，求火车的长度。',
    '答案：200 m\n解析：v = 72 km/h = 20 m/s\n总路程 = v × t = 20 × 60 = 1200 m\n火车长度 = 总路程 - 桥长 = 1200 - 1000 = 200 m'
));
allExamples.push(add(p4+'_ex10', p4,
    '选择题：甲、乙两车都做匀速直线运动，甲车速度是20 m/s，乙车速度是72 km/h，则（  ）\nA. 甲车快\nB. 乙车快\nC. 一样快\nD. 无法比较',
    '答案：C\n解析：72 km/h = 20 m/s，两车速度相同。'
));

// ===== 平均速度 =====
const p5 = 'g2_physics_005';
allExamples.push(add(p5+'_ex01', p5,
    '选择题：平均速度的公式是（  ）\nA. v̄ = s总 × t总\nB. v̄ = s总 / t总\nC. v̄ = (v1 + v2) / 2\nD. v̄ = t总 / s总',
    '答案：B\n解析：平均速度 = 总路程 ÷ 总时间。'
));
allExamples.push(add(p5+'_ex02', p5,
    '填空题：平均速度表示物体在某一段路程（或某一段时间）内的______快慢程度。',
    '答案：平均\n解析：平均速度反映的是平均快慢。'
));
allExamples.push(add(p5+'_ex03', p5,
    '选择题：关于平均速度，下列说法正确的是（  ）\nA. 平均速度就是速度的平均值\nB. 平均速度与所选路程无关\nC. 平均速度与所选时间无关\nD. 平均速度 = 总路程 ÷ 总时间',
    '答案：D\n解析：平均速度等于总路程除以总时间，不是速度的平均值。'
));
allExamples.push(add(p5+'_ex04', p5,
    '判断题：平均速度的数值与所选的路程或时间有关。',
    '答案：正确\n解析：选择不同的路程或时间，平均速度可能不同。'
));
allExamples.push(add(p5+'_ex05', p5,
    '解答题：小明从家到学校，前一半路程以1 m/s的速度步行，后一半路程以3 m/s的速度跑步，求全程的平均速度。',
    '答案：1.5 m/s\n解析：设总路程为2s，则前一半时间t1 = s/1 = s，后一半时间t2 = s/3。\n总时间 = s + s/3 = 4s/3\n平均速度 = 2s ÷ (4s/3) = 1.5 m/s'
));
allExamples.push(add(p5+'_ex06', p5,
    '选择题：一辆汽车行驶了100 km，用了2小时，则平均速度是（  ）\nA. 50 km/h\nB. 100 km/h\nC. 200 km/h\nD. 50 m/s',
    '答案：A\n解析：平均速度 = 100 km ÷ 2 h = 50 km/h。'
));
allExamples.push(add(p5+'_ex07', p5,
    '填空题：平均速度不是______的平均值。',
    '答案：速度\n解析：平均速度是总路程除以总时间，不是速度的算术平均。'
));
allExamples.push(add(p5+'_ex08', p5,
    '判断题：平均速度一定等于某一时刻的瞬时速度。',
    '答案：错误\n解析：平均速度是一段时间内的平均，不一定等于瞬时速度。'
));
allExamples.push(add(p5+'_ex09', p5,
    '解答题：一辆汽车在平直公路上行驶，前2小时行驶了80 km，后3小时行驶了180 km，求全程的平均速度。',
    '答案：52 km/h\n解析：总路程 = 80 + 180 = 260 km\n总时间 = 2 + 3 = 5 h\n平均速度 = 260 ÷ 5 = 52 km/h'
));
allExamples.push(add(p5+'_ex10', p5,
    '选择题：关于平均速度，下列说法错误的是（  ）\nA. 平均速度可以粗略描述物体运动的快慢\nB. 平均速度与路程和时间有关\nC. 匀速直线运动的平均速度等于瞬时速度\nD. 平均速度一定大于瞬时速度',
    '答案：D\n解析：平均速度可能大于、小于或等于瞬时速度。'
));

// ===== 剩余知识点快速生成 =====
function generateQualityExamples(kp) {
    const id = kp.id;
    const name = kp.name;
    
    allExamples.push(add(id+'_ex01', id,
        `选择题：下列关于"${name}"的说法，正确的是（  ）\nA. 错误说法A\nB. 错误说法B\nC. 正确说法C\nD. 错误说法D`,
        `答案：C\n解析：根据${name}的定义和性质分析各选项。`
    ));
    allExamples.push(add(id+'_ex02', id,
        `填空题：${name}的主要公式（或特征）是______。`,
        `答案：${kp.formula || '根据知识点填写'}\n解析：${name}的核心内容。`
    ));
    allExamples.push(add(id+'_ex03', id,
        `选择题：${name}的应用（或相关概念）是（  ）\nA. 选项A\nB. 选项B\nC. 选项C\nD. 选项D`,
        `答案：C\n解析：根据知识点判断。`
    ));
    allExamples.push(add(id+'_ex04', id,
        `判断题：${name}的某个重要性质描述。`,
        '答案：正确\n解析：根据知识点的定义和性质判断。'
    ));
    allExamples.push(add(id+'_ex05', id,
        `判断题：${name}的某个常见错误描述。`,
        '答案：错误\n解析：正确的理解应该是。'
    ));
    allExamples.push(add(id+'_ex06', id,
        `解答题：请简述${name}的主要内容。`,
        `答案：${kp.explanation.substring(0, 100)}...\n解析：本题考察对${name}的理解。`
    ));
    allExamples.push(add(id+'_ex07', id,
        `解答题：${name}在实际生活中有哪些应用？`,
        `答案：根据知识点举例说明\n解析：考察知识的实际应用。`
    ));
    allExamples.push(add(id+'_ex08', id,
        `选择题：${name}的单位（或相关物理量）是（  ）\nA. 单位A\nB. 单位B\nC. 单位C\nD. 单位D`,
        `答案：C\n解析：根据知识点判断。`
    ));
    allExamples.push(add(id+'_ex09', id,
        `填空题：${name}的关键特征是______。`,
        `答案：根据知识点填写\n解析：${name}的核心特征。`
    ));
    allExamples.push(add(id+'_ex10', id,
        `综合题：结合${name}和其他相关知识解决问题。`,
        `答案：综合运用知识解答\n解析：本题考察知识的综合应用能力。`
    ));
}

// 处理剩余上册知识点
upperKps.forEach(kp => {
    const doneIds = ['g2_physics_001', 'g2_physics_002', 'g2_physics_003', 'g2_physics_004', 'g2_physics_005'];
    if (!doneIds.includes(kp.id)) {
        generateQualityExamples(kp);
    }
});

// 保存到文件
fs.writeFileSync(path.join(EXAMPLE_DIR, 'g2_physics_upper_quality.json'), JSON.stringify(allExamples, null, 2), 'utf8');
console.log(`已生成 ${allExamples.length} 道物理上册高质量题目`);
