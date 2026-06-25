// 数据加载器 - 初中知识点背诵系统
// 负责从外部 JSON 文件加载知识点和例题数据，支持缓存

const DataLoader = {
    // 缓存存储
    cache: new Map(),
    
    // 数据基础路径
    basePath: 'data/',
    
    /**
     * 加载知识点数据
     * @param {string} grade - 年级标识，如 'g1', 'g2', 'g3'
     * @param {string} subject - 科目标识，如 'math', 'physics'
     * @param {string} semester - 学期标识，如 'upper', 'lower'
     * @returns {Promise<Array>} 知识点数组
     */
    async loadKnowledge(grade, subject, semester) {
        const cacheKey = `knowledge_${grade}_${subject}_${semester}`;
        
        // 检查缓存
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        const filePath = `${this.basePath}knowledge/${grade}_${subject}_${semester}.json`;
        
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`无法加载 ${filePath}`);
            }
            const data = await response.json();
            
            // 添加到缓存
            this.cache.set(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('加载知识点失败:', error);
            return [];
        }
    },
    
    /**
     * 加载单个知识点的例题
     * @param {string} knowledgeId - 知识点ID，如 'g2_math_001'
     * @returns {Promise<Array>} 例题数组
     */
    async loadExamples(knowledgeId) {
        const cacheKey = `examples_${knowledgeId}`;
        
        // 检查缓存
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        // 查找匹配的例题文件
        // 文件命名格式：g2_math_001_010.json (知识点ID_010)
        // 或 g2_physics_001_010.json
        const filePath = `${this.basePath}examples/${knowledgeId}_010.json`;
        
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                console.warn(`无法加载 ${filePath}`);
                return [];
            }
            const data = await response.json();
            
            // 添加到缓存
            this.cache.set(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('加载例题失败:', error);
            return [];
        }
    },
    
    /**
     * 获取随机例题
     * @param {string} knowledgeId - 知识点ID
     * @param {string} excludeId - 排除的例题索引（用于换一题功能）
     * @returns {Promise<Object|null>} 随机例题或null
     */
    async getRandomExample(knowledgeId, excludeId = null) {
        const examples = await this.loadExamples(knowledgeId);
        
        if (examples.length === 0) {
            return null;
        }
        
        if (examples.length === 1) {
            return examples[0];
        }
        
        // 随机选择一个
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * examples.length);
        } while (excludeId !== null && examples[randomIndex].id === excludeId && examples.length > 1);
        
        return examples[randomIndex];
    },
    
    /**
     * 获取数据统计信息
     * @returns {Object} 统计数据
     */
    async getStats() {
        const stats = {
            grades: {},
            totalKnowledge: 0,
            totalExamples: 0
        };
        
        // 已知的年级和科目组合
        const combinations = [
            { grade: 'g2', subject: 'math', semester: 'lower' },
            { grade: 'g2', subject: 'math', semester: 'upper' },
            { grade: 'g2', subject: 'physics', semester: 'upper' },
            { grade: 'g2', subject: 'physics', semester: 'lower' }
        ];
        
        for (const { grade, subject, semester } of combinations) {
            const key = `${grade}_${subject}_${semester}`;
            const knowledge = await this.loadKnowledge(grade, subject, semester);
            
            if (!stats.grades[grade]) {
                stats.grades[grade] = {};
            }
            if (!stats.grades[grade][subject]) {
                stats.grades[grade][subject] = {};
            }
            
            stats.grades[grade][subject][semester] = {
                knowledgeCount: knowledge.length,
                hasData: knowledge.length > 0
            };
            
            stats.totalKnowledge += knowledge.length;
            
            // 统计例题
            for (const k of knowledge) {
                const examples = await this.loadExamples(k.id);
                stats.totalExamples += examples.length;
            }
        }
        
        return stats;
    },
    
    /**
     * 清除所有缓存
     */
    clearCache() {
        this.cache.clear();
    },
    
    /**
     * 搜索知识点
     * @param {string} keyword - 搜索关键词
     * @param {Array} knowledgeList - 知识点列表
     * @returns {Array} 匹配的知识点
     */
    searchKnowledge(keyword, knowledgeList) {
        if (!keyword || keyword.trim() === '') {
            return [];
        }
        
        const lowerKeyword = keyword.toLowerCase().trim();
        
        return knowledgeList.filter(k => {
            return k.name.toLowerCase().includes(lowerKeyword) ||
                   k.chapter.toLowerCase().includes(lowerKeyword) ||
                   (k.formula && k.formula.toLowerCase().includes(lowerKeyword));
        });
    }
};

// 错题本管理器
const WrongBookManager = {
    STORAGE_KEY_PREFIX: 'wrongbook_',
    
    /**
     * 获取错题本数据
     * @param {string} grade - 年级
     * @param {string} subject - 科目
     * @returns {Array} 错题列表
     */
    getWrongBook(grade, subject) {
        const key = `${this.STORAGE_KEY_PREFIX}${grade}_${subject}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },
    
    /**
     * 添加错题
     * @param {Object} wrongItem - 错题对象
     * @returns {boolean} 是否添加成功
     */
    addWrongBook(wrongItem) {
        const { grade, subject, knowledgeId } = wrongItem;
        const key = `${this.STORAGE_KEY_PREFIX}${grade}_${subject}`;
        
        let wrongBook = this.getWrongBook(grade, subject);
        
        // 检查是否已存在
        const exists = wrongBook.some(item => 
            item.knowledgeId === knowledgeId && 
            item.question === wrongItem.question
        );
        
        if (exists) {
            return false; // 已存在，不重复添加
        }
        
        wrongBook.push({
            ...wrongItem,
            addedAt: new Date().toISOString()
        });
        
        localStorage.setItem(key, JSON.stringify(wrongBook));
        return true;
    },
    
    /**
     * 删除错题
     * @param {string} grade - 年级
     * @param {string} subject - 科目
     * @param {string} itemId - 错题ID
     */
    removeWrongBook(grade, subject, itemId) {
        const key = `${this.STORAGE_KEY_PREFIX}${grade}_${subject}`;
        let wrongBook = this.getWrongBook(grade, subject);
        
        wrongBook = wrongBook.filter(item => item.id !== itemId);
        
        localStorage.setItem(key, JSON.stringify(wrongBook));
    },
    
    /**
     * 获取所有错题本的年级-科目组合
     * @returns {Array} 年级科目组合列表
     */
    getAllWrongBookKeys() {
        const keys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
                const [, grade, subject] = key.split('_');
                const count = this.getWrongBook(grade, subject).length;
                keys.push({ grade, subject, count });
            }
        }
        
        return keys;
    },
    
    /**
     * 获取所有错题（跨年级科目）
     * @returns {Object} 以 grade_subject 为键的错题本
     */
    getAllWrongBooks() {
        const result = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
                const [, grade, subject] = key.split('_');
                result[`${grade}_${subject}`] = this.getWrongBook(grade, subject);
            }
        }
        
        return result;
    },
    
    /**
     * 清空指定错题本
     * @param {string} grade - 年级
     * @param {string} subject - 科目
     */
    clearWrongBook(grade, subject) {
        const key = `${this.STORAGE_KEY_PREFIX}${grade}_${subject}`;
        localStorage.removeItem(key);
    },

    /**
     * 导出所有错题本数据
     * @returns {Object} 所有错题数据
     */
    exportAll() {
        const result = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
                const data = localStorage.getItem(key);
                result[key] = JSON.parse(data);
            }
        }
        return result;
    },

    /**
     * 导入错题本数据
     * @param {Object} data - 错题本数据 { wrongbook_g2_math: [...], wrongbook_g2_physics: [...] }
     * @returns {number} 导入的错题数量
     */
    importAll(data) {
        let count = 0;
        for (const [key, items] of Object.entries(data)) {
            if (key.startsWith(this.STORAGE_KEY_PREFIX) && Array.isArray(items)) {
                const existing = JSON.parse(localStorage.getItem(key) || '[]');
                // 合并，去重
                for (const item of items) {
                    const exists = existing.some(e => e.question === item.question && e.knowledgeId === item.knowledgeId);
                    if (!exists) {
                        existing.push(item);
                        count++;
                    }
                }
                localStorage.setItem(key, JSON.stringify(existing));
            }
        }
        return count;
    }
};

// 导出到全局
window.DataLoader = DataLoader;
window.WrongBookManager = WrongBookManager;
