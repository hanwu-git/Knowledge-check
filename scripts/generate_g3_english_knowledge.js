const fs = require('fs');
const path = require('path');

const upperKnowledge = [
  {
    id: 'g3_english_001',
    chapter: 'Unit 1 How can we become good learners?',
    name: 'by + 动名词的用法',
    formula: 'by + v.ing 表示"通过……方式/方法"',
    explanation: '"by + 动名词"结构表示通过某种方式或手段做某事。例如：I learn English by watching English movies.（我通过看英语电影学习英语。）对by引导的方式状语提问用how。by还可以表示"在……旁边"、"乘坐交通工具"等含义。'
  },
  {
    id: 'g3_english_002',
    chapter: 'Unit 1 How can we become good learners?',
    name: '现在完成时与一般过去时的区别',
    formula: '现在完成时：have/has + 过去分词；一般过去时：主语 + 动词过去式',
    explanation: '现在完成时强调过去发生的动作对现在造成的影响或结果，常与already, yet, ever, never, just, before, so far, in the past few years等连用。一般过去时只表示过去发生的动作或存在的状态，与现在无关，常与yesterday, last week, ago, in 2008等具体过去时间状语连用。'
  },
  {
    id: 'g3_english_003',
    chapter: 'Unit 1 How can we become good learners?',
    name: 'so...that... 句型',
    formula: 'so + 形容词/副词 + that + 从句 表示"如此……以至于……"',
    explanation: 'so...that...引导结果状语从句，so后面接形容词或副词原级。例如：The book is so interesting that I have read it three times.（这本书如此有趣以至于我读了三遍。）同义句型：too...to...（太……而不能……）、enough to...（足够……去做……）。such...that...也表示"如此……以至于……"，such后面接名词短语。'
  },
  {
    id: 'g3_english_004',
    chapter: 'Unit 1 How can we become good learners?',
    name: '宾语从句的基本用法',
    formula: '主句 + 引导词 + 主语 + 谓语 + 其他',
    explanation: '宾语从句在复合句中作主句的宾语。引导词：that（陈述句变来，口语中that常省略）、if/whether（一般疑问句变来）、特殊疑问词（特殊疑问句变来）。语序：宾语从句一律用陈述语序（引导词 + 主语 + 谓语）。时态：主句是现在时，从句根据实际情况用各种时态；主句是过去时，从句用相应的过去时态；但从句表示的是客观真理、自然现象时，从句用一般现在时。'
  },
  {
    id: 'g3_english_005',
    chapter: 'Unit 2 I think that mooncakes are delicious!',
    name: '感叹句',
    formula: 'What + (a/an) + 形容词 + 名词 + 主语 + 谓语！；How + 形容词/副词 + 主语 + 谓语！',
    explanation: '感叹句用来表达强烈的情感。what引导的感叹句中心词是名词，可数名词单数前加a/an，复数或不可数名词不加。how引导的感叹句中心词是形容词或副词。例如：What a beautiful girl she is! = How beautiful the girl is! （这个女孩多漂亮啊！）在口语中，感叹句的主语和谓语常可省略。'
  },
  {
    id: 'g3_english_006',
    chapter: 'Unit 2 I think that mooncakes are delicious!',
    name: '宾语从句的时态问题',
    formula: '主现从不限；主过从必过；真理永一现',
    explanation: '宾语从句的时态要与主句保持一致：1. 主句是一般现在时，从句根据需要可用各种时态。2. 主句是一般过去时，从句必须用相应的过去时态（一般过去时、过去进行时、过去将来时、过去完成时）。3. 但如果从句表示的是客观真理、自然现象、科学事实，即使主句是过去时，从句仍用一般现在时。例如：The teacher told us that the earth goes around the sun.（老师告诉我们地球绕着太阳转。）'
  },
  {
    id: 'g3_english_007',
    chapter: 'Unit 2 I think that mooncakes are delicious!',
    name: 'used to 的用法',
    formula: 'used to + 动词原形 表示"过去常常做某事（现在不做了）"',
    explanation: 'used to do sth. 表示过去经常发生的动作或存在的状态，现在已经不那样了。否定形式：didn\'t use to do sth. 或 used not to do sth.。疑问形式：Did sb. use to do sth.? 或 Used sb. to do sth.?。be used to doing sth. 表示"习惯于做某事"（to是介词，后接动名词）。be used to do sth. 表示"被用来做某事"（被动语态）。'
  },
  {
    id: 'g3_english_008',
    chapter: 'Unit 3 Could you please tell me where the restrooms are?',
    name: '宾语从句的特殊疑问句形式',
    formula: '主句 + 特殊疑问词 + 主语 + 谓语 + 其他',
    explanation: '当宾语从句由特殊疑问句变来时，引导词就是特殊疑问词（what, who, whom, whose, which, when, where, why, how等），且从句必须用陈述语序。例如：I want to know where he lives.（我想知道他住在哪里。）注意：当特殊疑问词本身就是从句的主语时，语序不变。例如：I don\'t know what is wrong with him.（我不知道他怎么了。）'
  },
  {
    id: 'g3_english_009',
    chapter: 'Unit 3 Could you please tell me where the restrooms are?',
    name: '礼貌地请求帮助的表达',
    formula: 'Could you please do sth.? / Would you mind doing sth.? / Excuse me, could you tell me...?',
    explanation: '在英语中，向陌生人或长辈请求帮助时要用礼貌的表达。"Could you please + 动词原形"比"Can you..."更委婉客气。"Would you mind + doing"表示"你介意……吗？"。问路时常用"Excuse me, could you tell me how to get to...?"或"Could you please tell me where...is?"。回答时，如果可以帮忙，常用"Sure. / Certainly. / Of course. / No problem."等；如果不能帮忙，常用"Sorry, I\'m new here too."等。'
  },
  {
    id: 'g3_english_010',
    chapter: 'Unit 3 Could you please tell me where the restrooms are?',
    name: 'not...until... 句型',
    formula: 'not...until... 表示"直到……才……"',
    explanation: 'not...until...引导时间状语从句，表示主句的动作直到until所表示的时间才发生。例如：I didn\'t go to bed until I finished my homework last night.（昨晚我直到写完作业才睡觉。）当主句是一般将来时时，从句用一般现在时表示将来。until还可以作介词，后面接表示时间的名词。until引导的从句可用before替换，但语气上有区别：until侧重动作的延续，before侧重时间的先后。'
  },
  {
    id: 'g3_english_011',
    chapter: 'Unit 4 I used to be afraid of the dark.',
    name: 'used to 的反义疑问句',
    formula: '主语 + used to do..., didn\'t + 主语？/ usedn\'t + 主语？',
    explanation: '含有used to的句子，其反义疑问句的附加疑问部分用didn\'t + 主语（美式英语常用）或usedn\'t + 主语（英式英语常用）。例如：He used to be a teacher, didn\'t he? / usedn\'t he?（他过去是老师，对吗？）。注意：There used to be...句型的反义疑问句用didn\'t there? 或 usedn\'t there?。例如：There used to be a park here, didn\'t there?（这里以前有个公园，对吗？）'
  },
  {
    id: 'g3_english_012',
    chapter: 'Unit 4 I used to be afraid of the dark.',
    name: 'be afraid 的用法',
    formula: 'be afraid of + 名词/动名词；be afraid to do sth.；be afraid that + 从句',
    explanation: 'be afraid表示"害怕、担心"。be afraid of sth./doing sth. 表示"害怕某事/做某事"，侧重害怕的心理或担心某种结果。be afraid to do sth. 表示"不敢做某事"，侧重没有勇气做。be afraid that... 表示"担心/恐怕……"，that后接从句。I\'m afraid so. / I\'m afraid not. 是口语中常用的简略答语，意为"恐怕是这样/恐怕不是这样"。'
  },
  {
    id: 'g3_english_013',
    chapter: 'Unit 4 I used to be afraid of the dark.',
    name: '动名词作宾语',
    formula: 'enjoy/finish/practice/mind/suggest/consider/avoid等 + doing sth.',
    explanation: '英语中有些动词后面只能接动名词（v.ing形式）作宾语，不能接不定式。常见的有：enjoy（喜欢）、finish（完成）、practice（练习）、mind（介意）、suggest（建议）、consider（考虑）、avoid（避免）、miss（错过/想念）、keep（保持）、allow（允许）、admit（承认）、deny（否认）、imagine（想象）等。还有一些短语如be good at、be interested in、be used to（习惯于）、look forward to、pay attention to等后面也接动名词。'
  },
  {
    id: 'g3_english_014',
    chapter: 'Unit 5 What are the shirts made of?',
    name: '被动语态的基本结构',
    formula: 'be + 及物动词的过去分词',
    explanation: '被动语态表示主语是动作的承受者。各种时态的被动语态：1. 一般现在时：am/is/are + 过去分词；2. 一般过去时：was/were + 过去分词；3. 一般将来时：will be + 过去分词 或 am/is/are going to be + 过去分词；4. 现在进行时：am/is/are being + 过去分词；5. 过去进行时：was/were being + 过去分词；6. 现在完成时：have/has been + 过去分词；7. 情态动词：情态动词 + be + 过去分词。'
  },
  {
    id: 'g3_english_015',
    chapter: 'Unit 5 What are the shirts made of?',
    name: 'be made of/from/in/by/into 的区别',
    formula: 'be made of（看得出原料）/ be made from（看不出原料）/ be made in（产地）/ be made by（制造者）/ be made into（被制成）',
    explanation: 'be made of表示"由……制成"，能看出原材料（物理变化），如：The table is made of wood.（这张桌子是木制的。）be made from表示"由……制成"，看不出原材料（化学变化），如：Paper is made from wood.（纸是木头做的。）be made in表示"在某地制造"，如：This car is made in Germany.（这辆车是德国制造的。）be made by表示"被某人制造"。be made into表示"被制成……"。'
  },
  {
    id: 'g3_english_016',
    chapter: 'Unit 5 What are the shirts made of?',
    name: '被动语态与主动语态的转换',
    formula: '主动：主语 + 谓语 + 宾语 → 被动：宾语（变主语） + be + 过去分词 + by + 主语（变宾语）',
    explanation: '主动语态变被动语态的步骤：1. 把主动句的宾语变为被动句的主语；2. 把谓语变为"be + 过去分词"形式，时态与原句一致；3. 把主动句的主语变为by的宾语（代词用宾格），放在句末（by短语在不需要强调动作执行者时可省略）。注意：1. 双宾语的被动语态：可把间接宾语变为主语，直接宾语保留；也可把直接宾语变为主语，间接宾语前加to/for。2. 感官动词和使役动词的被动语态要还原to。'
  },
  {
    id: 'g3_english_017',
    chapter: 'Unit 6 When was it invented?',
    name: '一般过去时的被动语态',
    formula: 'was/were + 及物动词的过去分词',
    explanation: '一般过去时的被动语态表示过去某个时间主语被做了某事。结构：主语 + was/were + 过去分词 + 其他。例如：The telephone was invented by Alexander Graham Bell in 1876.（电话是由亚历山大·格雷厄姆·贝尔在1876年发明的。）一般疑问句：Was/Were + 主语 + 过去分词 + 其他？否定句：主语 + was/were + not + 过去分词 + 其他。'
  },
  {
    id: 'g3_english_018',
    chapter: 'Unit 6 When was it invented?',
    name: 'invent/discover/find 的区别',
    formula: 'invent（发明，创造新事物）/ discover（发现，本来就存在）/ find（找到，丢失的东西）',
    explanation: 'invent意为"发明"，指创造出前所未有的新事物，如发明机器、工具、方法等。discover意为"发现"，指发现本来就存在但以前不为人知的事物，如发现科学规律、新大陆等。find意为"找到、发现"，指经过寻找后找到丢失或失踪的人或物，侧重结果。find out意为"查明、弄清楚"，指经过调查、研究、计算等后发现或查明某事。'
  },
  {
    id: 'g3_english_019',
    chapter: 'Unit 6 When was it invented?',
    name: 'It is said that... 句型',
    formula: 'It is said that + 从句 表示"据说……"',
    explanation: 'It is said that...是一个常用句型，it作形式主语，真正的主语是that引导的主语从句。类似的结构还有：It is reported that...（据报道……）、It is believed that...（人们认为……）、It is known that...（众所周知……）、It is supposed that...（据推测……）、It is hoped that...（人们希望……）等。这些结构都可以转换为"People say/believe/know + that从句"或"sb. be said/believed/known to do sth."。'
  },
  {
    id: 'g3_english_020',
    chapter: 'Unit 7 Teenagers should be allowed to choose their own clothes.',
    name: '情态动词的被动语态',
    formula: '情态动词 + be + 及物动词的过去分词',
    explanation: '情态动词的被动语态表示"主语应该/能够/必须被……"。结构：主语 + 情态动词（should/can/must/may等） + be + 过去分词 + 其他。例如：Teenagers should be allowed to choose their own clothes.（青少年应该被允许选择自己的衣服。）否定式：主语 + 情态动词 + not + be + 过去分词。一般疑问句：情态动词 + 主语 + be + 过去分词？'
  },
  {
    id: 'g3_english_021',
    chapter: 'Unit 7 Teenagers should be allowed to choose their own clothes.',
    name: 'allow 的用法',
    formula: 'allow doing sth. / allow sb. to do sth. / sb. be allowed to do sth.',
    explanation: 'allow作动词，意为"允许"。1. allow doing sth. 允许做某事，如：We don\'t allow smoking here.（我们这里不允许抽烟。）2. allow sb. to do sth. 允许某人做某事，如：My parents allow me to watch TV on weekends.（我父母允许我周末看电视。）3. sb. be allowed to do sth. 某人被允许做某事（被动语态），如：Students are not allowed to use mobile phones in class.（学生不允许在课堂上使用手机。）'
  },
  {
    id: 'g3_english_022',
    chapter: 'Unit 7 Teenagers should be allowed to choose their own clothes.',
    name: 'get sth. done 的用法',
    formula: 'get + 宾语 + 过去分词 表示"让别人做某事"或"使某事被做"',
    explanation: 'get sth. done结构表示"使某事被做"，通常主语不是动作的执行者，而是让别人做。这里的过去分词作宾语补足语，与宾语之间是被动关系。例如：I need to get my hair cut.（我需要理发。=我需要让别人给我理发。）I will get my bike repaired tomorrow.（我明天要让人修我的自行车。）类似的结构还有have sth. done，意思基本相同。'
  },
  {
    id: 'g3_english_023',
    chapter: 'Unit 8 It must belong to Carla.',
    name: '情态动词表示推测',
    formula: 'must（肯定，90%）/ may might could（可能，40-60%）/ can\'t（不可能，0%） + 动词原形',
    explanation: '情态动词表示对现在情况的推测时，后面接动词原形。must表示肯定的推测，意为"一定、肯定"，只用于肯定句。may/might/could表示可能性的推测，意为"可能、也许"，might比may语气更弱，可能性更小。can\'t表示否定的推测，意为"不可能"，语气肯定。对现在正在进行的动作推测：情态动词 + be + doing。对过去事情的推测：情态动词 + have + 过去分词。'
  },
  {
    id: 'g3_english_024',
    chapter: 'Unit 8 It must belong to Carla.',
    name: 'belong to 的用法',
    formula: 'belong to sb. 表示"属于某人"',
    explanation: 'belong to意为"属于"，后面接名词或代词宾格。注意：1. belong to没有被动语态，不能说be belonged to。2. belong to没有进行时态。3. 对belong to后面的人提问用who/whom，对物提问用what。例如：The book belongs to me.（这本书是我的。）= The book is mine.（这本书是我的。）Who does this backpack belong to?（这个背包是谁的？）= Whose backpack is this?（这是谁的背包？）'
  }
];

const lowerKnowledge = [
  {
    id: 'g3_english_025',
    chapter: 'Unit 9 I like music that I can dance to.',
    name: '定语从句（that/who/which）',
    formula: '先行词 + that/which/who + 从句（修饰名词或代词）',
    explanation: '定语从句在复合句中修饰名词或代词，被修饰的词叫先行词。关系代词有who（指人，作主语或宾语）、whom（指人，作宾语）、whose（指人或物，作定语）、that（指人或物，作主语或宾语）、which（指物，作主语或宾语）。关系代词作主语时不能省略，作宾语时可以省略。注意：只能用that的情况：先行词是不定代词时、先行词被最高级或序数词修饰时、先行词既有人又有物时、先行词被the only/the very修饰时。'
  },
  {
    id: 'g3_english_026',
    chapter: 'Unit 9 I like music that I can dance to.',
    name: 'prefer 的用法',
    formula: 'prefer sth. / prefer doing sth. / prefer to do sth. / prefer...to... / prefer to do...rather than do...',
    explanation: 'prefer作动词，意为"更喜欢、宁愿"。1. prefer sth. 更喜欢某物，相当于like sth. better。2. prefer doing sth. / prefer to do sth. 更喜欢做某事。3. prefer A to B 喜欢A胜过B（to是介词），如：I prefer tea to coffee.（与咖啡相比，我更喜欢茶。）4. prefer doing A to doing B 喜欢做A胜过做B。5. prefer to do A rather than do B 宁愿做A也不愿做B。'
  },
  {
    id: 'g3_english_027',
    chapter: 'Unit 9 I like music that I can dance to.',
    name: '定语从句中的主谓一致',
    formula: '关系代词作主语时，从句谓语动词的数与先行词保持一致',
    explanation: '在定语从句中，当关系代词作主语时，从句谓语动词的人称和数要与先行词保持一致。例如：I prefer singers who write their own songs.（我更喜欢自己写歌的歌手。）先行词singers是复数，从句谓语用write。The book that is on the desk is mine.（桌上的那本书是我的。）先行词book是单数，从句谓语用is。注意：one of + 复数名词 + 定语从句，从句谓语用复数；the only one of + 复数名词 + 定语从句，从句谓语用单数。'
  },
  {
    id: 'g3_english_028',
    chapter: 'Unit 10 You\'re supposed to shake hands.',
    name: 'be supposed to 的用法',
    formula: 'be supposed to + 动词原形 表示"应该做某事、被期望做某事"',
    explanation: 'be supposed to do sth. 意为"应该做某事"、"被期望做某事"，表示根据规定、习惯、安排等应该做的事，相当于should，但语气更正式。否定形式be not supposed to do sth. 意为"不应该做某事"、"被禁止做某事"。例如：You are supposed to arrive on time.（你应该准时到达。）You are not supposed to smoke here.（你不应该在这里抽烟。）be supposed to have done sth. 表示"本应该做某事（但实际上没做）"，含有责备的意味。'
  },
  {
    id: 'g3_english_029',
    chapter: 'Unit 10 You\'re supposed to shake hands.',
    name: 'it作形式宾语的用法',
    formula: '主语 + 谓语 + it + 形容词/名词 + to do sth. / that从句',
    explanation: '当动词不定式或that从句作宾语且后面有宾语补足语时，常用it作形式宾语，把真正的宾语（不定式或从句）放在句末。结构：主语 + 谓语 + it + 形容词/名词 + 真正的宾语。常见的能接形式宾语的动词有find, think, make, feel, consider等。例如：I find it difficult to learn English well.（我发现学好英语很难。）I think it important that we should learn English well.（我认为我们学好英语很重要。）'
  },
  {
    id: 'g3_english_030',
    chapter: 'Unit 10 You\'re supposed to shake hands.',
    name: 'though/although 的用法',
    formula: 'though/although 虽然……，不能与but连用',
    explanation: 'though和although都表示"虽然、尽管"，引导让步状语从句，在大多数情况下可以互换使用。although比though更正式，多用于句首。though可用于句末，意为"可是、不过"，although不能。注意：汉语中说"虽然……但是……"，但英语中though/although不能与but连用，二者只能用其一。但可以与yet/still连用。例如：Although he is tired, he still goes on working.（虽然他累了，但他仍然继续工作。）'
  },
  {
    id: 'g3_english_031',
    chapter: 'Unit 11 Sad movies make me cry.',
    name: '使役动词make的用法',
    formula: 'make sb. do sth. / make sb. + 形容词 / make sb. + 名词 / be made to do sth.（被动）',
    explanation: 'make作使役动词，意为"使、让"。1. make sb. do sth. 使某人做某事，省略to的不定式作宾补。注意：被动语态中要还原to，即sb. be made to do sth.。2. make sb./sth. + 形容词，意为"使某人/某物处于某种状态"，如：The bad news made him sad.（这个坏消息使他伤心。）3. make sb./sth. + 名词，意为"使某人成为……、使某物成为……"。4. make it + 形容词 + to do sth. 表示"使做某事变得……"。'
  },
  {
    id: 'g3_english_032',
    chapter: 'Unit 11 Sad movies make me cry.',
    name: 'would rather 的用法',
    formula: 'would rather do sth. / would rather do sth. than do sth.',
    explanation: 'would rather意为"宁愿、宁可"，后面接动词原形。常与than连用，构成would rather do A than do B，意为"宁愿做A也不愿做B"。例如：I would rather stay at home than go out.（我宁愿待在家里也不愿出去。）注意：would rather...than...连接两个动词时，动词形式要一致。would rather后面还可以接从句，从句用虚拟语气（用过去时表示现在或将来的愿望，用过去完成时表示过去的愿望）。'
  },
  {
    id: 'g3_english_033',
    chapter: 'Unit 11 Sad movies make me cry.',
    name: 'neither...nor... 的用法',
    formula: 'neither A nor B 既不A也不B（连接两个相同的成分）',
    explanation: 'neither...nor...表示"既不……也不……"，是否定意义的连词，连接两个并列的成分。当连接两个主语时，谓语动词的数与最近的主语保持一致（就近原则）。例如：Neither he nor I am right.（他和我都不对。）Neither I nor he is right.（我和他都不对。）类似结构的还有either...or...（要么……要么……）、not only...but also...（不仅……而且……），都遵循就近原则。'
  },
  {
    id: 'g3_english_034',
    chapter: 'Unit 12 Life is full of the unexpected.',
    name: '过去完成时',
    formula: 'had + 过去分词 表示"过去的过去"',
    explanation: '过去完成时表示在过去某一时间或动作之前已经发生或完成的动作，即"过去的过去"。结构：主语 + had + 过去分词 + 其他。常与by the time, before, when, by the end of + 过去时间等连用。例如：By the time I got to the bus stop, the bus had already left.（当我到达公交车站时，公交车已经开走了。）过去完成时还可以表示从过去某一时间开始，持续到过去另一时间的动作或状态，常与for, since连用。'
  },
  {
    id: 'g3_english_035',
    chapter: 'Unit 12 Life is full of the unexpected.',
    name: 'by the time 的用法',
    formula: 'by the time + 一般过去时从句，主句用过去完成时',
    explanation: 'by the time意为"到……时候为止"，引导时间状语从句。如果从句用一般过去时，主句常用过去完成时，表示从句的动作发生在过去，主句的动作在从句动作之前就已经完成了。例如：By the time I arrived, the meeting had already begun.（当我到达时，会议已经开始了。）如果从句用一般现在时，主句用将来完成时或一般将来时。例如：By the time you come back, I will have finished the work.（到你回来时，我将已经完成工作了。）'
  },
  {
    id: 'g3_english_036',
    chapter: 'Unit 12 Life is full of the unexpected.',
    name: 'be full of / be filled with 的区别',
    formula: 'be full of 充满……（状态）/ be filled with 被……充满（动作）',
    explanation: 'be full of表示"充满……"，强调状态，full是形容词。be filled with表示"被……充满"，强调动作，是被动语态。两者意思基本相同，常可互换使用。例如：The bottle is full of water. = The bottle is filled with water.（瓶子里装满了水。）另外，fill...with...是主动结构，意为"用……装满……"，如：He filled the bottle with water.（他把瓶子装满了水。）'
  },
  {
    id: 'g3_english_037',
    chapter: 'Unit 13 We\'re trying to save the earth!',
    name: '现在进行时表示将来',
    formula: 'am/is/are + 现在分词（表示按计划、安排将要发生的动作）',
    explanation: '某些表示位置移动的动词，如go, come, leave, arrive, fly, start, move, travel等，常用现在进行时表示按计划或安排即将发生的动作，通常有一个表示将来的时间状语。例如：I\'m leaving for Beijing tomorrow.（我明天要去北京。）The train is arriving soon.（火车很快就要到了。）注意：不是所有动词都能用进行时表示将来，只有表示位置移动或开始、结束的动词才可以。'
  },
  {
    id: 'g3_english_038',
    chapter: 'Unit 13 We\'re trying to save the earth!',
    name: 'play a part in 的用法',
    formula: 'play a part in (doing) sth. 表示"在……中起作用/参与做某事"',
    explanation: 'play a part in (doing) sth. 意为"在……中扮演角色/起作用/参与"。part前可用different, important, necessary等形容词修饰。例如：Everyone should play a part in protecting the environment.（每个人都应该参与保护环境。）Computer plays an important part in our daily life.（电脑在我们的日常生活中起着重要作用。）类似的表达还有play a role in，意思和用法基本相同。'
  },
  {
    id: 'g3_english_039',
    chapter: 'Unit 13 We\'re trying to save the earth!',
    name: '现在完成进行时',
    formula: 'have/has been + 现在分词 表示"一直做某事"',
    explanation: '现在完成进行时表示从过去某一时间开始一直延续到现在的动作，这个动作可能刚停止，也可能还在继续进行。结构：主语 + have/has been + 现在分词。常与all day, all morning, recently, these days, for + 时间段, since + 时间点等连用。例如：I have been reading this book all day.（我一整天都在读这本书。）与现在完成时的区别：现在完成时强调动作的结果或完成，现在完成进行时强调动作的持续或一直在做。'
  },
  {
    id: 'g3_english_040',
    chapter: 'Unit 14 I remember meeting all of you in Grade 7.',
    name: 'remember/forget + to do/doing 的区别',
    formula: 'remember/forget to do 记得/忘记要做某事（未做）；remember/forget doing 记得/忘记做过某事（已做）',
    explanation: 'remember/forget后面接不定式（to do）表示"记得/忘记要去做某事"（事情还没做）；接动名词（doing）表示"记得/忘记做过某事"（事情已经做了）。例如：Please remember to close the door when you leave.（你离开时请记得关门。——还没关）I remember closing the door when I left.（我记得我离开时关了门的。——已经关了）类似用法的还有stop/go on/regret/mean/try等，但含义不同。'
  },
  {
    id: 'g3_english_041',
    chapter: 'Unit 14 I remember meeting all of you in Grade 7.',
    name: 'look forward to 的用法',
    formula: 'look forward to + 名词/代词/动名词 表示"期待、盼望"',
    explanation: 'look forward to是固定短语，意为"盼望、期待"，其中to是介词，后面接名词、代词或动名词（v.ing形式），不能接动词原形。例如：I\'m looking forward to your reply.（我期待着你的回复。）I\'m looking forward to hearing from you soon.（我期待着很快收到你的来信。）注意区分：used to do（过去常常做）、be used to doing（习惯于做）、be used to do（被用来做）。'
  },
  {
    id: 'g3_english_042',
    chapter: 'Unit 14 I remember meeting all of you in Grade 7.',
    name: 'wish/hope 的区别',
    formula: 'wish + to do / sb. to do / that从句（虚拟）；hope + to do / that从句（真实）',
    explanation: 'wish和hope都表示"希望"，但用法有区别：1. 都可接不定式作宾语：wish to do / hope to do。2. wish可接sb. to do，hope不能。3. 都可接that从句：wish后接从句用虚拟语气（用过去时表示现在不太可能实现的愿望，用过去完成时表示过去没实现的愿望）；hope后接从句用陈述语气，表示有可能实现的希望。4. wish后可接双宾语，意为"祝愿"，如：I wish you success.（祝你成功。）hope不能。'
  },
  {
    id: 'g3_english_043',
    chapter: '九年级拓展语法一',
    name: '非谓语动词综合',
    formula: '动词不定式（to do）、动名词（doing）、分词（现在分词doing/过去分词done）',
    explanation: '非谓语动词不能作谓语，但可以作主语、宾语、表语、定语、状语、宾语补足语等。动词不定式（to do）表示具体的、将要发生的动作。动名词（doing）表示抽象的、经常性的动作。现在分词（doing）表示主动、进行；过去分词（done）表示被动、完成。接不定式作宾语的动词：want, hope, wish, decide, plan, expect, afford, agree, refuse等。接动名词作宾语的动词：enjoy, finish, practice, mind, suggest, avoid, consider, keep等。'
  },
  {
    id: 'g3_english_044',
    chapter: '九年级拓展语法二',
    name: '主谓一致',
    formula: '语法一致、意义一致、就近一致',
    explanation: '主谓一致是指主语和谓语在人称和数上保持一致。基本原则：1. 语法一致原则：主语是单数，谓语用单数；主语是复数，谓语用复数。2. 意义一致原则：主语形式上是单数但意义上是复数，谓语用复数（如people, police, family等集体名词）；主语形式上是复数但意义上是单数，谓语用单数（如news, maths, physics, the United States等）。3. 就近原则：谓语动词的数与离它最近的主语一致，如there be句型、either...or..., neither...nor..., not only...but also...等。'
  },
  {
    id: 'g3_english_045',
    chapter: '九年级拓展语法三',
    name: '状语从句综合',
    formula: '时间、条件、原因、结果、目的、让步、比较、方式、地点状语从句',
    explanation: '状语从句在复合句中作状语，修饰主句的动词、形容词、副词等。时间状语从句：when, while, as, before, after, since, until, as soon as等。条件状语从句：if, unless, as long as等。原因状语从句：because, since, as等。结果状语从句：so...that..., such...that...等。目的状语从句：so that, in order that等。让步状语从句：though, although, even though, even if等。比较状语从句：than, as...as..., not so/as...as...等。注意：时间和条件状语从句中，主句用将来时，从句用一般现在时表示将来。'
  },
  {
    id: 'g3_english_046',
    chapter: '九年级拓展语法四',
    name: '定语从句综合',
    formula: '关系代词：who, whom, whose, which, that；关系副词：when, where, why',
    explanation: '定语从句修饰名词或代词（先行词）。关系代词：who（指人，主语/宾语）、whom（指人，宾语）、whose（指人/物，定语）、which（指物，主语/宾语）、that（指人/物，主语/宾语）。关系副词：when（时间状语）、where（地点状语）、why（原因状语）。关系代词作宾语时可省略，作主语时不能省略。只能用that的情况：先行词是不定代词、先行词被最高级/序数词修饰、先行词既有人又有物、先行词被the only/the very修饰。只能用which的情况：非限制性定语从句、介词 + which。'
  },
  {
    id: 'g3_english_047',
    chapter: '九年级拓展语法五',
    name: '名词性从句综合',
    formula: '主语从句、宾语从句、表语从句、同位语从句',
    explanation: '名词性从句在复合句中起名词作用，包括主语从句、宾语从句、表语从句和同位语从句。引导词有that（陈述句，无意义，宾语从句中常省略）、if/whether（一般疑问句，意为"是否"，只用whether的情况：介词后、or not、句首、作表语/同位语、后接不定式）、连接代词what, who, whom, whose, which（有意义，在从句中作主语/宾语/定语）、连接副词when, where, why, how（有意义，在从句中作状语）。语序：陈述语序。时态：主现从不限，主过从必过，真理永一现。'
  },
  {
    id: 'g3_english_048',
    chapter: '九年级拓展语法六',
    name: '虚拟语气',
    formula: '与现在/过去/将来事实相反的虚拟条件句',
    explanation: '虚拟语气表示与事实相反的假设或主观愿望。虚拟条件句的构成：1. 与现在事实相反：从句用过去式（be动词用were），主句用would/could/should/might + 动词原形。2. 与过去事实相反：从句用had + 过去分词，主句用would/could/should/might have + 过去分词。3. 与将来事实相反：从句用过去式或should + 动词原形或were to + 动词原形，主句用would/could/should/might + 动词原形。wish后面的宾语从句也用虚拟语气。注意：if省略时，从句要倒装。'
  }
];

const upperPath = path.join('data', 'knowledge', 'g3_english_upper.json');
const lowerPath = path.join('data', 'knowledge', 'g3_english_lower.json');

fs.writeFileSync(upperPath, JSON.stringify(upperKnowledge, null, 2), 'utf8');
fs.writeFileSync(lowerPath, JSON.stringify(lowerKnowledge, null, 2), 'utf8');

console.log(`上册知识点：${upperKnowledge.length} 个`);
console.log(`下册知识点：${lowerKnowledge.length} 个`);
console.log(`总共：${upperKnowledge.length + lowerKnowledge.length} 个知识点`);
console.log('文件已保存：g3_english_upper.json, g3_english_lower.json');
