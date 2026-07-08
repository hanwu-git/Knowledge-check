/**
 * 全局配置 - 唯一配置来源
 * 所有生成器、验证器都从这里读取配置
 */
const path = require('path');

// 数据目录
const DATA_DIR = 'data';
const KNOWLEDGE_DIR = path.join(DATA_DIR, 'knowledge');
const EXAMPLES_DIR = path.join(DATA_DIR, 'examples');

// 年级配置 - 唯一来源
const GRADES = {
    grade1: {
        name: '初一',
        shortName: '七',
        prefix: 'g1_',
        htmlPrefix: 'g1_',      // HTML文件名前缀
        subjects: {
            math: { name: '数学', color: 'blue', files: ['g1_math_upper.json', 'g1_math_lower.json'] },
            english: { name: '英语', color: 'green', files: ['g1_english_upper.json', 'g1_english_lower.json'] },
            chinese: { name: '语文', color: 'red', files: ['g1_chinese_upper.json', 'g1_chinese_lower.json'] },
            chinese_recite: { name: '语文重点背诵', color: 'red', files: ['g1_chinese_recite_upper.json', 'g1_chinese_recite_lower.json'], noExamples: true },
            english_vocab: { name: '英语词汇背诵', color: 'green', files: ['g1_english_vocab_upper.json', 'g1_english_vocab_lower.json'], noExamples: true },
            history: { name: '历史', color: 'orange', files: ['g1_history_upper.json', 'g1_history_lower.json'] },
            geography: { name: '地理', color: 'yellow', files: ['g1_geography_upper.json', 'g1_geography_lower.json'] },
            biology: { name: '生物', color: 'teal', files: ['g1_biology_upper.json', 'g1_biology_lower.json'] },
            daofa: { name: '道德与法治', color: 'pink', files: ['g1_daofa_upper.json', 'g1_daofa_lower.json'] }
        }
    },
    grade2: {
        name: '初二',
        shortName: '八',
        prefix: 'g2_',
        htmlPrefix: 'g2_',      // HTML文件名前缀
        subjects: {
            math: { name: '数学', color: 'blue', files: ['g2_math_upper.json', 'g2_math_lower.json'] },
            physics: { name: '物理', color: 'purple', files: ['g2_physics_upper.json', 'g2_physics_lower.json'] },
            english: { name: '英语', color: 'green', files: ['g2_english_upper.json', 'g2_english_lower.json'] },
            chinese: { name: '语文', color: 'red', files: ['g2_chinese_upper.json', 'g2_chinese_lower.json'] },
            chinese_recite: { name: '语文重点背诵', color: 'red', files: ['g2_chinese_recite_upper.json', 'g2_chinese_recite_lower.json'], noExamples: true },
            english_vocab: { name: '英语词汇背诵', color: 'green', files: ['g2_english_vocab_upper.json', 'g2_english_vocab_lower.json'], noExamples: true },
            history: { name: '历史', color: 'orange', files: ['g2_history_upper.json', 'g2_history_lower.json'] },
            geography: { name: '地理', color: 'yellow', files: ['g2_geography_upper.json', 'g2_geography_lower.json'] },
            biology: { name: '生物', color: 'teal', files: ['g2_biology_upper.json', 'g2_biology_lower.json'] },
            daofa: { name: '道德与法治', color: 'pink', files: ['g2_daofa_upper.json', 'g2_daofa_lower.json'] }
        }
    },
    grade3: {
        name: '初三',
        shortName: '九',
        prefix: 'g3_',
        htmlPrefix: 'g3_',
        subjects: {
            math: { name: '数学', color: 'blue', files: ['g3_math_upper.json', 'g3_math_lower.json'] },
            physics: { name: '物理', color: 'purple', files: ['g3_physics_upper.json', 'g3_physics_lower.json'] },
            chemistry: { name: '化学', color: 'teal', files: ['g3_chemistry_upper.json', 'g3_chemistry_lower.json'] },
            english: { name: '英语', color: 'green', files: ['g3_english_upper.json', 'g3_english_lower.json'] },
            chinese: { name: '语文', color: 'red', files: ['g3_chinese_upper.json', 'g3_chinese_lower.json'] },
            chinese_recite: { name: '语文重点背诵', color: 'red', files: ['g3_chinese_recite_upper.json', 'g3_chinese_recite_lower.json'], noExamples: true },
            english_vocab: { name: '英语词汇背诵', color: 'green', files: ['g3_english_vocab_upper.json', 'g3_english_vocab_lower.json'], noExamples: true },
            history: { name: '历史', color: 'orange', files: ['g3_history_upper.json', 'g3_history_lower.json'] },
            daofa: { name: '道德与法治', color: 'pink', files: ['g3_daofa_upper.json', 'g3_daofa_lower.json'] }
        }
    }
};

/**
 * 获取科目页面的HTML文件名
 * @param {string} gradeKey - 年级key (grade1, grade2)
 * @param {string} subjectKey - 科目key (math, physics...)
 * @returns {string} 文件名，如 'knowledge_g2_math.html'
 */
function getPageFileName(gradeKey, subjectKey) {
    const grade = GRADES[gradeKey];
    if (!grade) {
        throw new Error(`无效的年级: ${gradeKey}`);
    }
    return `knowledge_${grade.htmlPrefix}${subjectKey}.html`;
}

/**
 * 获取科目页面的链接URL
 * @param {string} gradeKey - 年级key
 * @param {string} subjectKey - 科目key
 * @param {string} semester - 学期 (upper, lower)
 * @returns {string} URL，如 'knowledge_g2_math.html?semester=upper'
 */
function getPageUrl(gradeKey, subjectKey, semester) {
    const fileName = getPageFileName(gradeKey, subjectKey);
    return `${fileName}?semester=${semester}`;
}

/**
 * 获取localStorage进度key的前缀
 * @param {string} gradeKey - 年级key
 * @param {string} subjectKey - 科目key
 * @returns {string} 前缀，如 'g2_math_'
 */
function getProgressPrefix(gradeKey, subjectKey) {
    const grade = GRADES[gradeKey];
    return `${grade.prefix}${subjectKey}_`;
}

/**
 * 获取所有科目配置（扁平化）
 * @returns {Object} 所有科目配置
 */
function getAllSubjects() {
    const all = {};
    Object.entries(GRADES).forEach(([gradeKey, grade]) => {
        Object.entries(grade.subjects).forEach(([subjectKey, subject]) => {
            const fullKey = `${gradeKey}_${subjectKey}`;
            all[fullKey] = {
                ...subject,
                gradeKey,
                gradeName: grade.name,
                gradePrefix: grade.prefix,
                htmlPrefix: grade.htmlPrefix,
                subjectKey,
                pageFileName: getPageFileName(gradeKey, subjectKey)
            };
        });
    });
    return all;
}

module.exports = {
    DATA_DIR,
    KNOWLEDGE_DIR,
    EXAMPLES_DIR,
    GRADES,
    getPageFileName,
    getPageUrl,
    getProgressPrefix,
    getAllSubjects
};