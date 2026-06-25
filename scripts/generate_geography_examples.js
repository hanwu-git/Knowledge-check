// 生成地理例题文件
const fs = require('fs');
const path = require('path');

const examplesDir = 'data/examples';

// 地理上册知识点（50个）
const geographyUpperIds = Array.from({length: 50}, (_, i) => `g2_geography_u${String(i+1).padStart(3, '0')}`);
// 地理下册知识点（35个）
const geographyLowerIds = Array.from({length: 35}, (_, i) => `g2_geography_l${String(i+1).padStart(3, '0')}`);

const allIds = [...geographyUpperIds, ...geographyLowerIds];

// 生成例题的函数
function generateExamples(knowledgeId) {
    const match = knowledgeId.match(/_([ul])(\d+)$/);
    const prefix = match[1]; // u or l
    const num = parseInt(match[2]);
    
    // 根据知识点生成相关练习
    const topics = {
        // 地理上册
        'u001': '中国的纬度位置',
        'u002': '中国的海陆位置',
        'u003': '中国领土面积',
        'u004': '中国疆界',
        'u005': '中国领海与岛屿',
        'u006': '中国行政区划',
        'u007': '中国人口数量',
        'u008': '中国人口分布特点',
        'u009': '中国民族构成',
        'u010': '中国民族分布特点',
        'u011': '中国民族政策',
        'u012': '中国地形特点',
        'u013': '中国地势特点',
        'u014': '四大高原',
        'u015': '四大盆地',
        'u016': '三大平原',
        'u017': '中国气候特点',
        'u018': '温度带划分',
        'u019': '干湿地区划分',
        'u020': '中国主要河流',
        'u021': '中国主要湖泊',
        'u022': '长江概况',
        'u023': '长江的开发',
        'u024': '长江的治理',
        'u025': '黄河概况',
        'u026': '黄河的贡献',
        'u027': '黄河的忧患',
        'u028': '黄河的治理',
        'u029': '自然资源概念',
        'u030': '中国自然资源特点',
        'u031': '土地资源类型',
        'u032': '土地资源分布',
        'u033': '水资源概念与分布',
        'u034': '水资源时间分布',
        'u035': '解决水资源不足的措施',
        'u036': '交通运输的重要性',
        'u037': '主要铁路干线',
        'u038': '南北向铁路干线',
        'u039': '东西向铁路干线',
        'u040': '交通运输方式选择',
        'u041': '中国农业分布',
        'u042': '主要农作物分布',
        'u043': '农业发展成就与问题',
        'u044': '中国工业分布',
        'u045': '辽中南工业基地',
        'u046': '京津唐工业基地',
        'u047': '沪宁杭工业基地',
        'u048': '珠江三角洲工业基地',
        'u049': '高新技术产业发展',
        'u050': '中国经济发展成就',
        // 地理下册
        'l001': '四大地理区域的划分',
        'l002': '秦岭-淮河一线的地理意义',
        'l003': '北方地区的范围和特征',
        'l004': '南方地区的范围和特征',
        'l005': '西北地区的范围和特征',
        'l006': '青藏地区的范围和特征',
        'l007': '北方地区的自然环境',
        'l008': '北方地区的农业',
        'l009': '东北三省的位置范围',
        'l010': '东北三省的农业',
        'l011': '东北三省的工业',
        'l012': '南方地区的自然环境',
        'l013': '南方地区的农业',
        'l014': '长江三角洲的位置和范围',
        'l015': '长江三角洲的经济发展',
        'l016': '香港的地理位置和行政区划',
        'l017': '香港的经济发展',
        'l018': '澳门的地理位置和行政区划',
        'l019': '澳门的经济发展',
        'l020': '西北地区的自然环境',
        'l021': '西北地区的农业',
        'l022': '坎儿井',
        'l023': '西北地区的气候特点',
        'l024': '西北地区的资源开发',
        'l025': '青藏地区的自然环境',
        'l026': '青藏地区的自然环境特征',
        'l027': '青藏地区的农业',
        'l028': '三江源地区的位置和意义',
        'l029': '三江源地区的生态问题与保护',
        'l030': '青藏铁路',
        'l031': '雅鲁藏布江谷地',
        'l032': '黄土高原',
        'l033': '四川盆地',
        'l034': '华北平原'
    };
    
    const topicKey = `${prefix}${String(num).padStart(3, '0')}`;
    const topic = topics[topicKey] || '地理综合';
    
    const examples = [];
    for (let i = 1; i <= 10; i++) {
        examples.push({
            id: `${knowledgeId}_ex${String(i).padStart(2, '0')}`,
            knowledge_id: knowledgeId,
            question: `根据知识点"${topic}"完成以下练习${i}：请回答关于"${topic}"的地理问题(${i}/10)`,
            answer: `这是关于"${topic}"的练习${i}的答案和详细解析。答案解析内容...`
        });
    }
    return examples;
}

// 生成所有例题文件
allIds.forEach(id => {
    const filePath = path.join(examplesDir, `${id}_010.json`);
    const examples = generateExamples(id);
    fs.writeFileSync(filePath, JSON.stringify(examples, null, 2), 'utf8');
});

console.log(`已生成 ${allIds.length} 个地理例题文件`);
