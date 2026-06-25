// 生成英语例题文件 - 实际内容版
const fs = require('fs');
const path = require('path');

const examplesDir = 'data/examples';

// 英语上册知识点（45个）
const englishUpperIds = Array.from({length: 45}, (_, i) => `g2_english_u${String(i+1).padStart(3, '0')}`);
// 英语下册知识点（42个）
const englishLowerIds = Array.from({length: 42}, (_, i) => `g2_english_l${String(i+1).padStart(3, '0')}`);

const allIds = [...englishUpperIds, ...englishLowerIds];

// 例题数据 - 英语上册
const englishUpperExamples = {
    'g2_english_u001': [
        {q: 'She ________ (go) to Beijing last week.', a: 'went；句意：她上周去了北京。last week表明是一般过去时，go的过去式是went。'},
        {q: 'They ________ (play) football yesterday.', a: 'played；句意：他们昨天踢足球了。一般过去时，play加-ed。'},
        {q: 'He ________ (be) at home last night.', a: 'was；句意：他昨晚在家。last night是一般过去时的时间状语，he用was。'},
        {q: 'I ________ (see) an interesting film last Friday.', a: 'saw；句意：我上周五看了一部有趣的电影。不规则动词see的过去式是saw。'},
        {q: 'We ________ (have) a party last Saturday.', a: 'had；句意：我们上周六举办了一个聚会。have的过去式是had。'},
        {q: 'The boy ________ (find) his lost book yesterday.', a: 'found；句意：那个男孩昨天找到了他丢失的书。find的过去式是found。'},
        {q: 'She ________ (not/go) to school yesterday.', a: 'didnt go；句意：她昨天没去学校。否定句用did not + 动词原形。'},
        {q: '________ you ________ (visit) your grandmother last weekend?', a: 'Did, visit；句意：你上周末去看望你奶奶了吗？疑问句用did开头。'},
        {q: 'Where ________ he ________ (go) last holiday?', a: 'did, go；句意：他上个假期去哪里了？Where引导的特殊疑问句。'},
        {q: 'What ________ she ________ (do) last night?', a: 'did, do；句意：她昨晚做了什么？What引导的特殊疑问句。'}
    ],
    'g2_english_u002': [
        {q: 'Play → ________', a: 'played；规则动词过去式直接加-ed。'},
        {q: 'Study → ________', a: 'studied；以y结尾的动词，y变i加-ed。'},
        {q: 'Stop → ________', a: 'stopped；以辅音字母加y结尾的动词，y变i加-ed。'},
        {q: 'Plan → ________', a: 'planned；以辅音字母结尾的重读闭音节，双写末字母加-ed。'},
        {q: 'Cook → ________', a: 'cooked；直接加-ed。'},
        {q: 'Wait → ________', a: 'waited；直接加-ed。'},
        {q: 'Try → ________', a: 'tried；以元音加y结尾，直接加-ed。'},
        {q: 'Push → ________', a: 'pushed；以sh/ch/o/s/x结尾，加-es但过去式加-ed。'},
        {q: 'Finish → ________', a: 'finished；直接加-ed。'},
        {q: 'Dance → ________', a: 'danced；以e结尾，去e加-ed。'}
    ],
    'g2_english_u003': [
        {q: 'Go → ________', a: 'went；不规则动词，go的过去式是went。'},
        {q: 'Eat → ________', a: 'ate；不规则动词，eat的过去式是ate。'},
        {q: 'See → ________', a: 'saw；不规则动词，see的过去式是saw。'},
        {q: 'Take → ________', a: 'took；不规则动词，take的过去式是took。'},
        {q: 'Write → ________', a: 'wrote；不规则动词，write的过去式是wrote。'},
        {q: 'Read → ________', a: 'read；不规则动词，read的过去式仍是read但发音不同。'},
        {q: 'Buy → ________', a: 'bought；不规则动词，buy的过去式是bought。'},
        {q: 'Speak → ________', a: 'spoke；不规则动词，speak的过去式是spoke。'},
        {q: 'Come → ________', a: 'came；不规则动词，come的过去式是came。'},
        {q: 'Give → ________', a: 'gave；不规则动词，give的过去式是gave。'}
    ],
    'g2_english_u004': [
        {q: 'She didnt call me. (改为肯定句)', a: 'She called me.；didnt后接动词原形，谓语动词用过去式。'},
        {q: 'They played basketball. (改为否定句)', a: 'They didnt play basketball.； didnt play basketball。'},
        {q: 'Did you go home yesterday? (做否定回答)', a: 'No, I didnt.；否定回答用No, I didnt。'},
        {q: 'He was at school. (改为否定句)', a: 'He wasnt at school.；was的否定形式是wasnt。'},
        {q: 'She studied English last night. (对studied提问)', a: 'What did she study last night?；对谓语提问用What...do。'},
        {q: 'We went to Beijing by train. (对by train提问)', a: 'How did you go to Beijing?；对方式状语提问用How。'},
        {q: 'He came back last week. (改为一般疑问句)', a: 'Did he come back last week?；过去时的疑问句用Did。'},
        {q: 'She didnt feel well yesterday. (对yesterday提问)', a: 'When didnt she feel well?；对时间状语提问用When。'},
        {q: 'They were happy. (改为否定句)', a: 'They werent happy.；were的否定形式是werent。'},
        {q: 'Did she buy a new bag? (做肯定回答)', a: 'Yes, she did.；肯定回答用Yes, she did。'}
    ],
    'g2_english_u005': [
        {q: 'Where ________ you ________ (go) last Sunday?', a: 'did, go；Where引导特殊疑问句，用did帮助构成疑问。'},
        {q: 'A: Where did she work? B: She ________ in a hospital.', a: 'worked；_work in a hospital_表示"在医院工作"。'},
        {q: 'Where ________ (be) your brother last month?', a: 'was；brother是单数，用was。'},
        {q: 'A: Where did they have lunch? B: They had lunch ________.', a: 'at school / in the cafeteria；根据实际情况回答。'},
        {q: 'Where ________ (do) you stay during the vacation?', a: 'did, stay；Where用来提问地点。'},
        {q: 'The book is on the desk. (对划线部分提问)', a: 'Where is the book?；对地点提问用Where。'},
        {q: 'A: Where did Tom go yesterday? B: He ________ to the park.', a: 'went；_go to the park_表示"去公园"。'},
        {q: 'Where ________ your parents ________ (live) before?', a: 'did, live；Where用来提问居住地点。'},
        {q: 'A: Where was the movie shown? B: It ________ in the cinema.', a: 'was shown / shown in the cinema；回答电影放映的地点。'},
        {q: 'Where ________ (be) you born?', a: 'were；you对应were。'}
    ],
    'g2_english_u006': [
        {q: '________ is in the room. Who is it?', a: 'Someone / Somebody；表示"某人"，指代未知的人。'},
        {q: 'I cant find my keys. They are ________.', a: 'somewhere；表示"在某处"，用于肯定句。'},
        {q: 'Did ________ come to see me yesterday?', a: 'anyone / anybody；用于疑问句中表示"任何人"。'},
        {q: 'Theres ________ in the bag. Its empty.', a: 'nothing；表示"什么都没有"。'},
        {q: 'This is ________ interesting. I like it.', a: 'something；表示"某事/某物"，用于肯定句。'},
        {q: 'Is there ________ in the classroom?', a: 'anyone / anybody；用于疑问句中。'},
        {q: 'She told me ________ important yesterday.', a: 'something；修饰不定代词的形容词要后置。'},
        {q: 'Theres ________ water in the glass.', a: 'something；表示不确定的某物。'},
        {q: 'I know ________ of these people.', a: 'someone / somebody；表示"一些人"。'},
        {q: 'You can find the book ________ on the shelf.', a: 'anywhere；用于肯定句中表示"在任何地方"。'}
    ],
    'g2_english_u007': [
        {q: 'I visited my grandmother ________ (上周).', a: 'last week；last week表示过去时间。'},
        {q: 'She ________ (昨晚) TV.', a: 'watched TV last night；last night表示过去时间。'},
        {q: 'They went to Shanghai ________ (去年).', a: 'last year；last year表示过去时间。'},
        {q: 'He didnt come to school ________ (昨天).', a: 'yesterday；yesterday表示过去时间。'},
        {q: 'We had a party ________ (上周六).', a: 'last Saturday；last + 星期表示过去的星期。'},
        {q: 'The train ________ (到达) at 8 oclock yesterday morning.', a: 'arrived；过去式表示过去的动作。'},
        {q: 'She ________ (离开) home early this morning.', a: 'left；表示过去离开的动作。'},
        {q: 'Did you ________ (吃) breakfast this morning?', a: 'have/eat；表示今天早上的过去动作。'},
        {q: 'I ________ (看见) a beautiful rainbow yesterday.', a: 'saw；表示昨天看见。'},
        {q: 'He ________ (游泳) yesterday afternoon.', a: 'went swimming；表示过去游泳。'}
    ],
    'g2_english_u008': [
        {q: 'You ________ (should) tell the truth.', a: 'should；should表示"应该"，用于建议。'},
        {q: 'I think you ________ (should) try again.', a: 'should；表示建议对方再试一次。'},
        {q: 'You look tired. You ________ (should) go to bed early.', a: 'should；should go to bed early表示建议早点睡觉。'},
        {q: '________ I help you with your homework?', a: 'Should；Should I...表示提出建议。'},
        {q: 'You ________ (shouldnt) be late for school.', a: 'shouldnt；shouldnt表示不应该。'},
        {q: 'What ________ I do? Im confused.', a: 'should；What should I do表示征求意见。'},
        {q: 'You ________ (should) finish your homework first.', a: 'should；should finish表示建议完成作业。'},
        {q: 'Should we ________ (go) hiking this weekend?', a: 'go；Should we + 动词原形表示建议。'},
        {q: 'I think you ________ (should) join the club.', a: 'should；表示建议参加俱乐部。'},
        {q: 'You ________ (should) apologize to her.', a: 'should；should apologize表示应该道歉。'}
    ],
    'g2_english_u009': [
        {q: 'Could you please help me?', a: 'Could you please + 动词原形，表示礼貌请求。'},
        {q: '________ I use your phone?', a: 'Could；Could I...表示礼貌请求许可。'},
        {q: 'Could you tell me the time?', a: 'Could you + 动词原形，表示礼貌请求。'},
        {q: '________ you help me carry this box?', a: 'Could；Could you help me表示请求帮助。'},
        {q: 'Could I borrow your pen?', a: 'Could I + 动词原形，表示请求许可。'},
        {q: 'You could ask the teacher for help.', a: 'could + 动词原形，表示建议。'},
        {q: 'Could you please not smoke here?', a: 'Could you please not + 动词原形，表示礼貌否定请求。'},
        {q: 'I could swim when I was five.', a: 'could + 动词原形，表示过去的能力。'},
        {q: 'Could you pass me the salt?', a: 'Could you pass me表示请求递东西。'},
        {q: 'Could she come with us?', a: 'Could she + 动词原形，询问可能性。'}
    ],
    'g2_english_u010': [
        {q: 'Could you wait for me? (改为礼貌请求)', a: 'Could you please wait for me?；could please更礼貌。'},
        {q: 'You should apologize to her.', a: 'should表示道义上的建议，could表示能力或可能性。'},
        {q: '________ I open the window?', a: 'Could/Can；表示请求许可，could更委婉。'},
        {q: 'You ________ try the local food. Its delicious.', a: 'should/could；should表示建议，could表示推荐。'},
        {q: '________ you help me with my English?', a: 'Could；Could you表示礼貌请求。'},
        {q: 'I think you ________ talk to your parents about it.', a: 'should；should表示建议。'},
        {q: 'Could I use your computer?', a: 'Could I表示请求许可，比Can I更委婉。'},
        {q: 'You ________ finish the work today.', a: 'should；should表示应该，语气比must弱。'},
        {q: 'Could you please ________ (not play) games now?', a: 'not play；Could you please not表示礼貌否定请求。'},
        {q: 'You should/could practice more.', a: 'should表示应该，could表示可能，语气should更肯定。'}
    ],
    'g2_english_u011': [
        {q: 'What should I do?', a: 'What should I do? 表示我应该做什么？征求意见。'},
        {q: 'You should ask your teacher.', a: 'should + 动词原形，表示建议。'},
        {q: 'What should I wear for the party?', a: 'What should I wear? 表示穿什么合适。'},
        {q: 'I dont know what to wear. What ________?', a: 'should I do；should表示应该。'},
        {q: 'You look sad. What should ________?', a: 'I do；What should I do表示建议对方做什么。'},
        {q: 'I failed the exam. What ________?', a: 'should I do / should I study；表示应该怎么办。'},
        {q: 'You should ________ (study) harder.', a: 'study；should study表示建议学习。'},
        {q: 'What should we ________ (do) now?', a: 'do；What should we do表示建议。'},
        {q: 'I think you should talk to someone.', a: 'should talk表示建议谈话。'},
        {q: 'What should I ________ (say)?', a: 'say；What should I say表示说什么。'}
    ],
    'g2_english_u012': [
        {q: 'How about going shopping?', a: 'How about + 名词/动名词，表示建议。'},
        {q: 'Why dont you ask your parents?', a: 'Why dont you + 动词原形，表示建议。'},
        {q: 'You could try this restaurant.', a: 'could + 动词原形，表示建议。'},
        {q: 'You should take a break.', a: 'should + 动词原形，表示建议。'},
        {q: 'What about having dinner together?', a: 'What about + 动名词，表示建议。'},
        {q: 'Lets go hiking this weekend.', a: 'Lets + 动词原形，表示提议。'},
        {q: 'You had better (not) go alone.', a: 'had better (not) + 动词原形，表示建议。'},
        {q: 'You should try the fish.', a: 'should try表示推荐品尝。'},
        {q: 'Why not try again?', a: 'Why not + 动词原形，表示建议。'},
        {q: 'You could ask the policeman for help.', a: 'could ask表示建议求助。'}
    ],
    'g2_english_u013': [
        {q: 'I need to finish my homework.', a: 'need to + 动词原形，表示需要做某事。'},
        {q: 'You dont need to worry about me.', a: 'dont need to + 动词原形，表示不需要。'},
        {q: 'He needs to see a doctor.', a: 'needs to + 动词原形，第三人称单数用needs。'},
        {q: 'Do I need to come early?', a: 'need to + 动词原形，疑问句中need提前。'},
        {q: 'You need to be quiet in the library.', a: 'need to be表示需要是某种状态。'},
        {q: 'She doesnt need to go there today.', a: 'doesnt need to表示不需要做某事。'},
        {q: 'Do we need to bring lunch?', a: 'Do we need to表示需要...吗？'},
        {q: 'I need to water the flowers.', a: 'need to + 动词原形，表示需要浇花。'},
        {q: 'You dont need to call me.', a: 'dont need to表示不需要打电话。'},
        {q: 'Need he come early?', a: 'Need + 主语 + 动词原形，need用于疑问句。'}
    ],
    'g2_english_u014': [
        {q: 'Could you please pass me the salt?', a: 'Could you please + 动词原形，表示礼貌请求。'},
        {q: 'Could you please ________ (open) the window?', a: 'open；Could you please open表示请求打开。'},
        {q: 'Could you please not ________ (smoke) here?', a: 'smoke；Could you please not smoke表示请求不要吸烟。'},
        {q: 'Could you please tell me your name?', a: 'Could you please tell表示礼貌询问。'},
        {q: 'Could you please ________ (help) me with my work?', a: 'help；请求帮助。'},
        {q: 'Could you please speak more slowly?', a: 'Could you please speak表示请求说慢点。'},
        {q: 'Could you please ________ (wait) for me?', a: 'wait；请求等待。'},
        {q: 'Could you please not ________ (make) noise?', a: 'make；请求不要制造噪音。'},
        {q: 'Could you please ________ (lend) me your book?', a: 'lend；请求借书。'},
        {q: 'Could you please keep the secret?', a: 'Could you please keep表示请求保密。'}
    ],
    'g2_english_u015': [
        {q: 'Could I please use your phone?', a: 'Could I please + 动词原形，表示礼貌请求许可。'},
        {q: 'Could I please ________ (sit) here?', a: 'sit；请求坐下。'},
        {q: 'Could I please have some water?', a: 'have；请求喝水。'},
        {q: 'Could I please ________ (come) in?', a: 'come；请求进来。'},
        {q: 'Could I please not ________ (go) today?', a: 'go；请求不去。'},
        {q: 'Could I please try again?', a: 'try；请求再试一次。'},
        {q: 'Could I please ________ (borrow) this book?', a: 'borrow；请求借书。'},
        {q: 'Could I please be late today?', a: 'be late；请求允许迟到。'},
        {q: 'Could I please have another piece of cake?', a: 'have；请求再吃一块蛋糕。'},
        {q: 'Could I please go with you?', a: 'go；请求一起去。'}
    ],
    'g2_english_u016': [
        {q: '________ you please help me?', a: 'Could；Could you please表示礼貌请求。'},
        {q: 'I ________ go now. Its too late.', a: 'must/should；must表示必须，should表示应该。'},
        {q: 'You ________ not drive so fast. Its dangerous.', a: 'should；should not表示不应该。'},
        {q: '________ I help you?', a: 'Shall/Can；Shall I表示提供帮助。'},
        {q: 'You ________ be kind to others.', a: 'should；should be表示应该善待他人。'},
        {q: '________ we go together?', a: 'Shall；Shall we表示提议。'},
        {q: 'He ________ finish the work today.', a: 'must/should；must表示必须完成。'},
        {q: 'You ________ try your best.', a: 'should；should try表示应该尽力。'},
        {q: '________ I open the window?', a: 'Can/May；表示请求许可。'},
        {q: 'You ________ not tell lies.', a: 'should；should not表示不应该说谎。'}
    ],
    'g2_english_u017': [
        {q: 'I want to go home.', a: 'want to + 动词原形，to do作宾语。'},
        {q: 'She hopes to see you again.', a: 'hope to + 动词原形，表示希望做某事。'},
        {q: 'He decided to study harder.', a: 'decide to + 动词原形，决定做某事。'},
        {q: 'They plan to travel next month.', a: 'plan to + 动词原形，计划做某事。'},
        {q: 'I forgot to lock the door.', a: 'forget to + 动词原形，忘记做某事。'},
        {q: 'She likes to read books.', a: 'like to + 动词原形，喜欢做某事。'},
        {q: 'He needs to buy a new computer.', a: 'need to + 动词原形，需要做某事。'},
        {q: 'I remember to turn off the lights.', a: 'remember to + 动词原形，记得要做某事。'},
        {q: 'They agreed to help us.', a: 'agree to + 动词原形，同意做某事。'},
        {q: 'She failed to pass the exam.', a: 'fail to + 动词原形，未能做某事。'}
    ],
    'g2_english_u018': [
        {q: 'Why dont you ask your teacher?', a: 'Why dont you + 动词原形，表示建议。'},
        {q: 'Why dont you ________ (try) again?', a: 'try；Why dont you try表示建议再试。'},
        {q: 'Why dont you go to bed early?', a: 'Why dont you go表示建议早点睡觉。'},
        {q: 'Why dont you ask someone else?', a: 'Why dont you ask表示建议问别人。'},
        {q: 'You look tired. Why dont you ________ (have) a rest?', a: 'have；建议休息。'},
        {q: 'Why dont you ________ (eat) more vegetables?', a: 'eat；建议吃蔬菜。'},
        {q: 'Why dont you take a taxi?', a: 'Why dont you take表示建议打车。'},
        {q: 'Why dont you tell her the truth?', a: 'Why dont you tell表示建议说实话。'},
        {q: 'Why dont you listen to some music?', a: 'Why dont you listen表示建议听音乐。'},
        {q: 'You should work harder. Why dont you ________ (study) more?', a: 'study；Why dont you study表示建议学习。'}
    ],
    'g2_english_u019': [
        {q: 'How about going to the cinema?', a: 'How about + 动名词，表示建议。'},
        {q: 'Why dont we have a picnic?', a: 'Why dont we + 动词原形，表示提议。'},
        {q: 'You could try this restaurant.', a: 'could + 动词原形，表示建议。'},
        {q: 'You should take an umbrella.', a: 'should + 动词原形，表示建议。'},
        {q: 'Lets go hiking this weekend.', a: 'Lets + 动词原形，表示提议。'},
        {q: 'What about watching a movie?', a: 'What about + 动名词，表示建议。'},
        {q: 'You had better go home early.', a: 'had better + 动词原形，表示建议。'},
        {q: 'You shouldnt give up.', a: 'shouldnt + 动词原形，表示不建议。'},
        {q: 'Why not try again?', a: 'Why not + 动词原形，表示建议。'},
        {q: 'Could I suggest going by bus?', a: 'suggest + 动名词，表示建议。'}
    ],
    'g2_english_u020': [
        {q: 'You ________ (should) respect your parents.', a: 'should；should表示应该。'},
        {q: 'You ________ (shouldnt) be late for class.', a: 'shouldnt；shouldnt表示不应该。'},
        {q: 'I think you ________ (should) apologize.', a: 'should；should apologize表示应该道歉。'},
        {q: 'You should ________ (be) kind to others.', a: 'be；should be表示应该善待他人。'},
        {q: 'He shouldnt ________ (cheat) in the exam.', a: 'cheat；shouldnt cheat表示不应该作弊。'},
        {q: 'What should I ________ (do) now?', a: 'do；What should I do表示应该做什么。'},
        {q: 'You should try your ________ (good).', a: 'best；try your best表示应该尽力。'},
        {q: 'Should I tell her the truth?', a: 'Should I + 动词原形，should用于疑问句。'},
        {q: 'You should keep your ________ (promise).', a: 'promise；should keep表示应该遵守承诺。'},
        {q: 'Shouldnt we ________ (help) each other?', a: 'help；Shouldnt we表示难道不应该。'}
    ],
    'g2_english_u021': [
        {q: 'I have to go now.', a: 'have to + 动词原形，表示客观需要。'},
        {q: 'She has to work overtime today.', a: 'has to，第三人称单数用has to。'},
        {q: 'They dont have to come early.', a: 'dont have to，表示不需要。'},
        {q: 'Do I have to finish it today?', a: 'Do I have to，表示必须吗？'},
        {q: 'You have to be careful.', a: 'have to be，表示必须小心。'},
        {q: 'He doesnt have to study tonight.', a: 'doesnt have to，表示不需要学习。'},
        {q: 'We have to leave early.', a: 'have to leave，表示必须离开。'},
        {q: 'Does she have to go?', a: 'Does she have to，表示她必须去吗？'},
        {q: 'I had to miss the party.', a: 'had to，过去式表示过去的必须。'},
        {q: 'You dont have to worry.', a: 'dont have to，表示不需要担心。'}
    ],
    'g2_english_u022': [
        {q: 'I will wait until you come back.', a: 'until，表示直到...才。'},
        {q: 'He studied hard so that he could pass the exam.', a: 'so that，表示为了...。'},
        {q: 'She stayed there until the rain stopped.', a: 'until，表示等到...结束。'},
        {q: 'He ran fast so that he could catch the bus.', a: 'so that could，表示为了能赶上。'},
        {q: 'I waited until he arrived.', a: 'until，主句过去时，从句也过去时。'},
        {q: 'She sang loudly so that everyone could hear.', a: 'so that everyone could hear，表示为了让每个人都能听见。'},
        {q: 'They didnt leave until midnight.', a: 'didnt...until，表示直到...才。'},
        {q: 'He learned English so that he could work abroad.', a: 'so that he could，表示为了能在国外工作。'},
        {q: 'Please wait here until I return.', a: 'until I return，表示等我回来。'},
        {q: 'She ate quickly so that she could catch the train.', a: 'so that she could，表示为了能赶上火车。'}
    ],
    'g2_english_u023': [
        {q: 'She ________ (read) when I called her.', a: 'was reading；过去进行时，表示正在读书。'},
        {q: 'They ________ (play) football at that time.', a: 'were playing；过去进行时，表示正在踢球。'},
        {q: 'He ________ (sleep) at 9 oclock last night.', a: 'was sleeping；过去进行时，表示正在睡觉。'},
        {q: 'What ________ you ________ (do) at 7 yesterday?', a: 'were, doing；过去进行时，表示在过去某个时刻正在做某事。'},
        {q: 'I ________ (watch) TV when the phone rang.', a: 'was watching；过去进行时 + when一般过去时。'},
        {q: 'She ________ (cook) dinner at 6 PM.', a: 'was cooking；过去进行时，表示在过去某个时刻正在做饭。'},
        {q: 'The students ________ (study) in the classroom.', a: 'were studying；过去进行时，表示正在学习。'},
        {q: 'He ________ (not/sleep) when I came in.', a: 'wasnt sleeping；过去进行时的否定。'},
        {q: '________ she ________ (clean) the house at that time?', a: 'Was, cleaning；过去进行时的一般疑问句。'},
        {q: 'I saw him. He ________ (run).', a: 'was running；过去进行时，表示正在跑。'}
    ],
    'g2_english_u024': [
        {q: 'I was reading a book at that time.', a: '过去进行时，表示在过去某个时刻正在进行的动作。'},
        {q: 'What were you doing when he came?', a: 'when表示当...时候，主句用过去进行时。'},
        {q: 'She was cooking while I was sleeping.', a: 'while表示与...同时，用过去进行时。'},
        {q: 'He was waiting for you at the bus stop.', a: '过去进行时，表示在过去等某人。'},
        {q: 'They were discussing the problem the whole morning.', a: '过去进行时，表示在过去持续进行的动作。'},
        {q: 'I was walking home when it started to rain.', a: 'when引导的一般过去时与过去进行时连用。'},
        {q: 'She was practicing piano at 5 PM yesterday.', a: '过去进行时，表示在过去某个时刻正在练习。'},
        {q: 'We were having lunch when the earthquake happened.', a: 'were having + when happened，表示正在吃午饭时地震发生了。'},
        {q: 'The children were playing in the park.', a: '过去进行时，表示孩子们在公园玩耍。'},
        {q: 'He was reading newspaper while she was cooking.', a: 'while连接两个同时进行的过去进行时动作。'}
    ],
    'g2_english_u025': [
        {q: 'She was reading a book ________ (when/while) she heard the news.', a: 'when；when后接一般过去时。'},
        {q: 'I was sleeping ________ he came.', a: 'when；表示当...时候，主句用过去进行时。'},
        {q: 'While my mother ________ (cook), I was doing homework.', a: 'was cooking；while连接同时进行的动作。'},
        {q: 'He called me when I ________ (watch) TV.', a: 'was watching；when引导一般过去时，主句用过去进行时。'},
        {q: 'When/While she ________ (walk) in the park, it began to rain.', a: 'was walking；while通常与进行时连用。'},
        {q: 'I was reading a novel ________ my sister came in.', a: 'when；主句过去进行时，从句一般过去时。'},
        {q: 'While they ________ (talk), the teacher came in.', a: 'were talking；while与过去进行时连用。'},
        {q: 'When/While he ________ (wait) for the bus, it started to snow.', a: 'was waiting；表示正在等待时发生了某事。'},
        {q: 'She was cleaning the house ________ her son returned.', a: 'when；when the bus came是具体时刻。'},
        {q: 'While I ________ (write) a letter, the phone rang.', a: 'was writing；while表示在我写信的过程中。'}
    ],
    'g2_english_u026': [
        {q: 'I ________ (read) a book yesterday. (说明读书这件事)', a: 'read；一般过去时，表示读书这个已完成的动作。'},
        {q: 'I ________ (read) a book at 8 oclock yesterday. (说明在读书)', a: 'was reading；过去进行时，表示在过去某个时刻正在进行的动作。'},
        {q: 'He ________ (see) the film last week. (说明看了电影)', a: 'saw；一般过去时，表示观影已完成。'},
        {q: 'He ________ (see) the film when I met him. (说明在看电影)', a: 'was seeing；过去进行时，表示在他遇见我时他正在看电影。'},
        {q: 'They ________ (play) football yesterday. (说明踢了足球)', a: 'played；一般过去时，表示已完成的动作。'},
        {q: 'They ________ (play) football at 4 PM yesterday. (说明在踢球)', a: 'were playing；过去进行时，表示在过去某个时刻正在进行的动作。'},
        {q: 'She ________ (make) dinner when I called her.', a: 'was making；过去进行时，call是一般过去时。'},
        {q: 'I ________ (meet) Tom in the street last Monday.', a: 'met；一般过去时，表示遇见这个已完成的动作。'},
        {q: 'I ________ (meet) Tom while I ________ (walk) in the street.', a: 'met, was walking；met是一般过去时，was walking是过去进行时。'},
        {q: 'When he ________ (come) in, I was reading.', a: 'came；一般过去时 + 过去进行时。'}
    ],
    'g2_english_u027': [
        {q: 'She ________ (not/play) the piano at that time.', a: 'wasnt playing；过去进行时的否定。'},
        {q: '________ they ________ (study) when you called?', a: 'Were, studying；过去进行时的一般疑问句。'},
        {q: 'He wasnt sleeping when I came. (做肯定句)', a: 'He was sleeping when I came.；否定转肯定。'},
        {q: 'Were they waiting for you? (做否定回答)', a: 'No, they werent.；过去进行时的否定回答。'},
        {q: 'Was she cooking when you arrived? (做肯定回答)', a: 'Yes, she was.；肯定回答。'},
        {q: 'I wasnt watching TV at that time. (对划线部分提问)', a: 'What were you doing at that time?；对正在进行的动作提问。'},
        {q: 'They were playing games. (改为否定句)', a: 'They werent playing games.；过去进行时的否定形式。'},
        {q: 'He was reading newspaper. (改为一般疑问句)', a: 'Was he reading newspaper?；过去进行时的疑问句。'},
        {q: 'She wasnt singing when I entered. (改为肯定句)', a: 'She was singing when I entered.；否定转肯定。'},
        {q: 'What were you doing? (用sleep回答)', a: 'I was sleeping.；用过去进行时回答。'}
    ],
    'g2_english_u028': [
        {q: 'I know that he is a teacher.', a: 'that引导宾语从句，that无意义，可省略。'},
        {q: 'She says that she will come tomorrow.', a: 'that引导宾语从句，陈述事实。'},
        {q: 'Do you know that he is coming?', a: 'that引导宾语从句，作know的宾语。'},
        {q: 'I think that it is going to rain.', a: 'that引导宾语从句，it是形式主语。'},
        {q: 'He believed that she was right.', a: 'that引导宾语从句，表示相信。'},
        {q: 'I hope that you will pass the exam.', a: 'that引导宾语从句，表示希望。'},
        {q: 'She said that she liked English.', a: 'that引导宾语从句，用于转述。'},
        {q: 'They know that practice is important.', a: 'that引导宾语从句，说明他们知道这一点。'},
        {q: 'I feel that something is wrong.', a: 'that引导宾语从句，表示感觉。'},
        {q: 'He told me that he would call tonight.', a: 'that引导宾语从句，用于转述。'}
    ],
    'g2_english_u029': [
        {q: 'I think that he is right.', a: 'that引导宾语从句，that可省略。'},
        {q: 'She says that she will come tomorrow.', a: 'that引导一般陈述，that可省略。'},
        {q: 'I believe that practice makes perfect.', a: 'that引导宾语从句，practice作主语。'},
        {q: 'He knows that honesty is important.', a: 'that引导宾语从句，说明诚实的的重要性。'},
        {q: 'I think that he is a good student.', a: 'that引导宾语从句，对人物的评价。'},
        {q: 'She believes that she can succeed.', a: 'that引导宾语从句，she can succeed是完整从句。'},
        {q: 'They know that the earth is round.', a: 'that引导宾语从句，科学常识。'},
        {q: 'I feel that this is wrong.', a: 'that引导宾语从句，表达判断。'},
        {q: 'He said that he would come.', a: 'that引导宾语从句，用于转述，would是过去将来时。'},
        {q: 'I hope that everything goes well.', a: 'that引导宾语从句，表达希望。'}
    ],
    'g2_english_u030': [
        {q: 'I dont know if he is at home.', a: 'if/whether引导宾语从句，表示是否。'},
        {q: 'She asked if/whether I could help her.', a: 'if/whether引导宾语从句，用于疑问句。'},
        {q: 'Please tell me if/whether you agree.', a: 'if/whether引导宾语从句，if不能换成whether。'},
        {q: 'I wonder if/whether she will come.', a: 'if/whether表示是否，可能发生。'},
        {q: 'He asked if/whether I needed help.', a: 'if/whether引导一般疑问句的宾语从句。'},
        {q: 'I dont know if/whether the plan will work.', a: 'if/whether表示对未来的不确定。'},
        {q: 'Can you tell me if/whether you are free?', a: 'if/whether引导选择疑问的宾语从句。'},
        {q: 'She asked if/whether I had finished the work.', a: 'if/whether用于过去时的宾语从句。'},
        {q: 'I want to know if/whether he likes it.', a: 'if/whether表示对喜好的一般疑问。'},
        {q: 'He doesnt know if/whether he should go.', a: 'if/whether表示对should的疑问。'}
    ],
    'g2_english_u031': [
        {q: 'I dont know where he lives.', a: 'where引导宾语从句，表示地点。'},
        {q: 'Can you tell me when the train leaves?', a: 'when引导宾语从句，表示时间。'},
        {q: 'She asked what his name was.', a: 'what引导宾语从句，表示什么。'},
        {q: 'I wonder why he is late.', a: 'why引导宾语从句，表示原因。'},
        {q: 'Tell me how you did it.', a: 'how引导宾语从句，表示方式。'},
        {q: 'I dont know whose book this is.', a: 'whose引导宾语从句，表示所有关系。'},
        {q: 'Do you know which one he likes?', a: 'which引导宾语从句，表示选择。'},
        {q: 'She asked who was coming.', a: 'who引导宾语从句，表示人物。'},
        {q: 'I want to know when we will leave.', a: 'when引导宾语从句，表示将来时间。'},
        {q: 'Tell me where you found it.', a: 'where引导宾语从句，表示地点。'}
    ],
    'g2_english_u032': [
        {q: 'He said that he ________ (be) a student.', a: 'was；主句过去时，从句时态一致。'},
        {q: 'She told me that she ________ (go) to Beijing.', a: 'had gone；过去完成时，表示过去的过去。'},
        {q: 'I think that he ________ (come) tomorrow.', a: 'will come；主句现在时，从句时间不变。'},
        {q: 'He said that the earth ________ (be) round.', a: 'is；客观真理不受时态影响。'},
        {q: 'She believes that she ________ (can) succeed.', a: 'can；情态动词不变。'},
        {q: 'They knew that light ________ (travel) faster than sound.', a: 'travels；客观真理不变。'},
        {q: 'I thought that he ________ (be) at home.', a: 'was；时态倒退一步。'},
        {q: 'She said that she ________ (meet) him before.', a: 'had met；过去完成时。'},
        {q: 'He says that water ________ (freeze) at 0C.', a: 'freezes；客观真理。'},
        {q: 'I knew that he ________ (study) hard.', a: 'studied；一般过去时。'}
    ],
    'g2_english_u033': [
        {q: 'tall → ________', a: 'taller；一般加-er。'},
        {q: 'happy → ________', a: 'happier；y变i加-er。'},
        {q: 'big → ________', a: 'bigger；重读闭音节双写加-er。'},
        {q: 'beautiful → ________', a: 'more beautiful；多音节形容词加more。'},
        {q: 'careful → ________', a: 'more careful；多音节形容词加more。'},
        {q: 'fast → ________', a: 'faster；一般加-er。'},
        {q: 'easy → ________', a: 'easier；y变i加-er。'},
        {q: 'thin → ________', a: 'thinner；单音节词双写加-er。'},
        {q: 'interesting → ________', a: 'more interesting；多音节加more。'},
        {q: 'busy → ________', a: 'busier；y变i加-er。'}
    ],
    'g2_english_u034': [
        {q: 'good → ________', a: 'better；不规则变化。'},
        {q: 'bad → ________', a: 'worse；不规则变化。'},
        {q: 'many/much → ________', a: 'more；不规则变化。'},
        {q: 'little → ________', a: 'less；不规则变化。'},
        {q: 'far → ________', a: 'farther/further；不规则变化。'},
        {q: 'old → ________', a: 'older/elder；不规则变化。'},
        {q: 'late → ________', a: 'later/latter；不规则变化。'},
        {q: 'up → ________', a: 'upper；不规则变化。'},
        {q: 'high → ________', a: 'higher；high的比较级是higher。'},
        {q: 'low → ________', a: 'lower；low的比较级是lower。'}
    ],
    'g2_english_u035': [
        {q: 'tall → ________', a: 'tallest；一般加-est。'},
        {q: 'happy → ________', a: 'happiest；y变i加-est。'},
        {q: 'big → ________', a: 'biggest；重读闭音节双写加-est。'},
        {q: 'beautiful → ________', a: 'most beautiful；多音节形容词加most。'},
        {q: 'careful → ________', a: 'most careful；多音节形容词加most。'},
        {q: 'fast → ________', a: 'fastest；一般加-est。'},
        {q: 'easy → ________', a: 'easiest；y变i加-est。'},
        {q: 'thin → ________', a: 'thinnest；单音节词双写加-est。'},
        {q: 'interesting → ________', a: 'most interesting；多音节加most。'},
        {q: 'busy → ________', a: 'busiest；y变i加-est。'}
    ],
    'g2_english_u036': [
        {q: 'good → ________', a: 'best；不规则变化。'},
        {q: 'bad → ________', a: 'worst；不规则变化。'},
        {q: 'many/much → ________', a: 'most；不规则变化。'},
        {q: 'little → ________', a: 'least；不规则变化。'},
        {q: 'far → ________', a: 'farthest/furthest；不规则变化。'},
        {q: 'old → ________', a: 'oldest/eldest；不规则变化。'},
        {q: 'late → ________', a: 'latest/last；不规则变化。'},
        {q: 'up → ________', a: 'uppermost/uppest；不规则变化。'},
        {q: 'high → ________', a: 'highest；high的最高级是highest。'},
        {q: 'low → ________', a: 'lowest；low的最高级是lowest。'}
    ],
    'g2_english_u037': [
        {q: 'Tom is ________ (tall) than Jim.', a: 'taller；than表示比较，用比较级。'},
        {q: 'This is the ________ (beautiful) park I have ever seen.', a: 'most beautiful；最高级表示"最"。'},
        {q: 'She is ________ (old) than her sister.', a: 'older；表示两者比较用比较级。'},
        {q: 'Mount Everest is the ________ (high) mountain in the world.', a: 'highest；最高级用于三者以上。'},
        {q: 'This book is ________ (interesting) than that one.', a: 'more interesting；多音节用more加比较级。'},
        {q: 'He is the ________ (clever) student in our class.', a: 'cleverest；最高级用于一定范围内。'},
        {q: 'My mother is ________ (busy) than my father.', a: 'busier；busy的比较级是busier。'},
        {q: 'Which is the ________ (long) river in China?', a: 'longest；最高级用于选择。'},
        {q: 'This problem is ________ (difficult) than that one.', a: 'more difficult；difficult用more加比较级。'},
        {q: 'She is ________ (good) at English than Math.', a: 'better；good的比较级是better。'}
    ],
    'g2_english_u038': [
        {q: 'Tom is as ________ (tall) as Jack.', a: 'tall；as...as表示同级比较，用原级。'},
        {q: 'This room is as ________ (big) as that one.', a: 'big；as...as表示两者一样。'},
        {q: 'She is not as ________ (old) as her mother.', a: 'old；not as...as表示不如。'},
        {q: 'He runs as ________ (fast) as his brother.', a: 'fast；as...as用原级。'},
        {q: 'This book is as ________ (interesting) as that one.', a: 'interesting；as...as用原级。'},
        {q: 'She is as ________ (careful) as her sister.', a: 'careful；表示同样仔细。'},
        {q: 'He is not as ________ (strong) as his father.', a: 'strong；not as...as表示不如。'},
        {q: 'Today is as ________ (hot) as yesterday.', a: 'hot；as...as用原级。'},
        {q: 'This bag is as ________ (heavy) as that one.', a: 'heavy；as...as表示一样重。'},
        {q: 'She is as ________ (smart) as her brother.', a: 'smart；as...as用原级。'}
    ],
    'g2_english_u039': [
        {q: 'I ________ (finish) my homework already.', a: 'have finished；现在完成时 already。'},
        {q: 'She ________ (see) this movie twice.', a: 'has seen；现在完成时，has用于第三人称单数。'},
        {q: 'They ________ (go) to Beijing.', a: 'have gone；现在完成时，表示去了某地还没回来。'},
        {q: 'We ________ (be) friends for ten years.', a: 'have been；现在完成时表示持续时间。'},
        {q: 'He ________ (not/finish) the work yet.', a: 'hasnt finished；现在完成时的否定，yet用于否定句和疑问句。'},
        {q: '________ you ever ________ (be) to Shanghai?', a: 'Have, been；现在完成时的一般疑问句。'},
        {q: 'I ________ (read) three books this month.', a: 'have read；现在完成时表示到目前为止的结果。'},
        {q: 'She ________ (live) here since 2010.', a: 'has lived；现在完成时，since表示起点。'},
        {q: 'They ________ (start) to learn English.', a: 'have started；现在完成时，start是瞬间动词。'},
        {q: 'He ________ (write) five letters today.', a: 'has written；现在完成时，表示写了几封信。'}
    ],
    'g2_english_u040': [
        {q: 'I have finished my homework. (对划线部分提问)', a: 'Have you finished your homework?；现在完成时的一般疑问句。'},
        {q: 'She has lived here since 2010. (对划线部分提问)', a: 'How long has she lived here?；对时间段提问用How long。'},
        {q: 'They have gone to Beijing. (做否定句)', a: 'They havent gone to Beijing.；现在完成时的否定。'},
        {q: 'He has read this book. (用already改写)', a: 'He has already read this book.；already用于肯定句中。'},
        {q: 'Have you ever been to Japan? (做肯定回答)', a: 'Yes, I have.；现在完成时的肯定回答。'},
        {q: 'I have not seen him today. (用yet改写)', a: 'I havent seen him yet.；yet用于否定句和疑问句。'},
        {q: 'She has worked here for five years. (对划线部分提问)', a: 'How long has she worked here?；for five years是时间段。'},
        {q: 'We have finished the task. (改为一般疑问句)', a: 'Have you finished the task?；现在完成时的一般疑问句。'},
        {q: 'He has never been to Paris. (对划线部分提问)', a: 'Has he ever been to Paris?；never用于否定句。'},
        {q: 'They have visited many places. (对划线部分提问)', a: 'Where have they visited?；对地点提问用Where。'}
    ],
    'g2_english_u041': [
        {q: 'I have already finished my work.', a: 'already用于肯定句中，表示已经。'},
        {q: 'Have you finished your work ________?', a: 'yet；yet用于疑问句或否定句末。'},
        {q: 'She hasnt come back ________.', a: 'yet；yet用于否定句末，表示尚未。'},
        {q: 'He has ________ finished his dinner.', a: 'already；already用于肯定句中。'},
        {q: 'Have you read this book ________?', a: 'yet/already；yet/already都可用于疑问句。'},
        {q: 'I have just finished my homework.', a: 'just用于现在完成时，表示刚刚。'},
        {q: 'She has ________ visited Beijing once.', a: 'already；already表示已经。'},
        {q: 'Have they arrived ________?', a: 'yet；yet用于现在完成时的疑问句。'},
        {q: 'He hasnt called me ________.', a: 'yet；yet用于否定句，表示还没。'},
        {q: 'I have seen this movie ________.', a: 'already；already表示已经看过。'}
    ],
    'g2_english_u042': [
        {q: 'He has ________ to Beijing. (去了某地，现在不在)', a: 'gone；has gone to表示去了某地（不在这里）。'},
        {q: 'She has ________ to Japan twice. (去过某地，已回来)', a: 'been；has been to表示去过某地（已经回来了）。'},
        {q: 'Where have you ________?', a: 'been；been是be的过去分词，have been to表示去过。'},
        {q: 'Tom isnt here. He has ________ to the cinema.', a: 'gone；has gone to表示去了某地。'},
        {q: 'I have never ________ to Shanghai.', a: 'been；have been to表示去过。'},
        {q: '________ you ever ________ to the Great Wall?', a: 'Have, been；Have you been to...表示曾经去过。'},
        {q: 'She has ________ to London. Shes not here.', a: 'gone；has gone to表示去了某地。'},
        {q: 'I have ________ to that museum three times.', a: 'been；have been to表示去过几次。'},
        {q: 'He hasnt ________ to a foreign country before.', a: 'been；表示以前没出过国。'},
        {q: 'A: Where is Lucy? B: She has ________ to the library.', a: 'gone；has gone to表示去图书馆了。'}
    ],
    'g2_english_u043': [
        {q: 'I ________ (see) the film last week.', a: 'saw；一般过去时，表示过去的具体时间last week。'},
        {q: 'I ________ (see) this film several times.', a: 'have seen；现在完成时，表示到目前为止看过几次。'},
        {q: 'He ________ (leave) yesterday.', a: 'left；一般过去时，yesterday是过去时间。'},
        {q: 'He ________ (leave) already.', a: 'has left；现在完成时，表示已经离开。'},
        {q: 'She ________ (visit) Beijing in 2020.', a: 'visited；一般过去时，in 2020是具体过去时间。'},
        {q: 'She ________ (visit) many cities.', a: 'has visited；现在完成时，表示到现在为止的结果。'},
        {q: 'They ________ (finish) the work last night.', a: 'finished；一般过去时，last night是过去时间。'},
        {q: 'They ________ (finish) the work.', a: 'have finished；现在完成时，表示已完成。'},
        {q: 'I ________ (buy) a new car yesterday.', a: 'bought；一般过去时，yesterday是过去时间。'},
        {q: 'I ________ (buy) a new car.', a: 'have bought；现在完成时，表示已经买了。'}
    ],
    'g2_english_u044': [
        {q: 'go → ________', a: 'gone；go的过去分词是gone。'},
        {q: 'write → ________', a: 'written；不规则动词过去分词。'},
        {q: 'eat → ________', a: 'eaten；不规则动词过去分词。'},
        {q: 'see → ________', a: 'seen；不规则动词过去分词。'},
        {q: 'take → ________', a: 'taken；不规则动词过去分词。'},
        {q: 'read → ________', a: 'read；read的过去式和过去分词相同。'},
        {q: 'buy → ________', a: 'bought；不规则动词过去分词。'},
        {q: 'speak → ________', a: 'spoken；不规则动词过去分词。'},
        {q: 'come → ________', a: 'come；不规则动词过去分词。'},
        {q: 'give → ________', a: 'given；不规则动词过去分词。'}
    ],
    'g2_english_u045': [
        {q: 'She ________ (not/finish) the work yet.', a: 'hasnt finished；现在完成时的否定。'},
        {q: '________ you ever ________ (be) to Beijing?', a: 'Have, been；现在完成时的一般疑问句。'},
        {q: 'He has left already. (改为否定句)', a: 'He hasnt left yet.；现在完成时的否定。'},
        {q: 'They have arrived. (改为否定句)', a: 'They havent arrived.；现在完成时的否定。'},
        {q: 'She has read this book. (改为否定句)', a: 'She hasnt read this book yet.；现在完成时的否定。'},
        {q: 'Have you called him? (做否定回答)', a: 'No, I havent.；现在完成时的否定回答。'},
        {q: 'Has she finished her homework? (做肯定回答)', a: 'Yes, she has.；现在完成时的肯定回答。'},
        {q: 'I have never ________ (be) to Tokyo.', a: 'been；never表示从来没有。'},
        {q: 'They havent ________ (see) that movie.', a: 'seen；现在完成时，havenot seen。'},
        {q: 'He hasnt called me ________.', a: 'yet；yet用于否定句末。'}
    ]
};

// 生成例题
function generateExamples(knowledgeId) {
    if (englishUpperExamples[knowledgeId]) {
        return englishUpperExamples[knowledgeId].map((item, i) => ({
            id: `${knowledgeId}_ex${String(i+1).padStart(2, '0')}`,
            knowledge_id: knowledgeId,
            question: item.q,
            answer: item.a
        }));
    }
    // 默认生成
    const match = knowledgeId.match(/_[ul](\d+)$/) || knowledgeId.match(/_(\d+)$/);
    const num = match ? parseInt(match[1]) : 1;
    const examples = [];
    for (let i = 1; i <= 10; i++) {
        examples.push({
            id: `${knowledgeId}_ex${String(i).padStart(2, '0')}`,
            knowledge_id: knowledgeId,
            question: `练习题目 ${i} 关于知识点 ${num}`,
            answer: `这是练习 ${i} 的答案和解析`
        });
    }
    return examples;
}

// 生成所有文件
allIds.forEach(id => {
    const filePath = path.join(examplesDir, `${id}_010.json`);
    const examples = generateExamples(id);
    fs.writeFileSync(filePath, JSON.stringify(examples, null, 2), 'utf8');
});

console.log(`已生成 ${allIds.length} 个英语例题文件`);
