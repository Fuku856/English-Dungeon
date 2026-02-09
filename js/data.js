// English Dungeon Game Data
// ユーザー編集用ファイル。日本語のコメントに従って問題を編集してください。

/**
 * Type A: Slash (単語力)
 * 画面を飛び交う日本語訳オーブから正解を斬るゲーム。
 * en: 表示される英単語
 * jp: 正解の日本語訳
 */
const vocabList = [
    { en: "Dormitory", jp: "寮" },
    { en: "Library", jp: "図書館" },
    { en: "Cafeteria", jp: "食堂" },
    { en: "Gymnasium", jp: "体育館" },
    { en: "Laboratory", jp: "実験室" },
    { en: "Auditorium", jp: "講堂" },
    { en: "Playground", jp: "運動場" },
    { en: "Principal", jp: "校長" },
    { en: "Subject", jp: "教科" },
    { en: "Semester", jp: "学期" },
    { en: "Infirmary", jp: "保健室" },
    { en: "Corridor", jp: "廊下" },
    { en: "Assignment", jp: "課題" },
    { en: "Attendance", jp: "出席" },
    { en: "Graduation", jp: "卒業" },
    { en: "Curriculum", jp: "教育課程" },
    { en: "Counselor", jp: "相談員" },
    { en: "Literature", jp: "文学" },
    { en: "Composition", jp: "作文" },
    { en: "Dictionary", jp: "辞書" },
    { en: "Presentation", jp: "発表" },
    { en: "Stationery", jp: "文房具" },
    { en: "Commute", jp: "通学" },
    { en: "Representative", jp: "代表者" },
    { en: "Certificate", jp: "証明書" },
    { en: "Discipline", jp: "規律" },
    { en: "Knowledge", jp: "知識" },
    { en: "Experience", jp: "経験" },
    { en: "Achievement", jp: "業績" },
    { en: "Experiment", jp: "実験" },
    { en: "Reference", jp: "参照" },
    { en: "Admission", jp: "入学" },
    { en: "Lecture", jp: "講義" },
    { en: "Seminar", jp: "演習" },
    { en: "Mathematics", jp: "数学" },
    { en: "Biology", jp: "生物" },
    { en: "Chemistry", jp: "化学" },
    { en: "Geography", jp: "地理" },
    { en: "Uniform", jp: "制服" },
    { en: "Entrance", jp: "入り口・入学" },
    { en: "Festival", jp: "文化祭・祭り" },
    { en: "Examination", jp: "試験" },
    { en: "Vacation", jp: "休暇" },
    { en: "Classmate", jp: "同級生" },
    { en: "Improve", jp: "向上させる" },
    { en: "Participate", jp: "参加する" },
    { en: "Counselor", jp: "相談員" },
    { en: "Literature", jp: "文学" },
    { en: "Composition", jp: "作文" },
    { en: "Dictionary", jp: "辞書" },
    { en: "Presentation", jp: "発表" },
    { en: "Stationery", jp: "文房具" },
    { en: "Commute", jp: "通学" },
    { en: "Representative", jp: "代表者" },
    { en: "Certificate", jp: "証明書" },
    { en: "Discipline", jp: "規律" },
    { en: "Knowledge", jp: "知識" },
    { en: "Experience", jp: "経験" },
    { en: "Achievement", jp: "業績" },
    { en: "Experiment", jp: "実験" },
    { en: "Reference", jp: "参照" },
    { en: "Admission", jp: "入学" },
    { en: "Lecture", jp: "講義" },
    { en: "Seminar", jp: "演習" },
    { en: "Mathematics", jp: "数学" },
    { en: "Biology", jp: "生物" },
    { en: "Chemistry", jp: "化学" },
    { en: "Geography", jp: "地理" },
    { en: "Uniform", jp: "制服" },
    { en: "Entrance", jp: "入り口・入学" },
    { en: "Festival", jp: "文化祭・祭り" },
    { en: "Examination", jp: "試験" },
    { en: "Vacation", jp: "休暇" },
    { en: "Classmate", jp: "同級生" },
    { en: "Improve", jp: "向上させる" },
    { en: "Participate", jp: "参加する" },
    { en: "Prepare", jp: "準備する" },
    { en: "Review", jp: "復習する" },
    { en: "Creative", jp: "創造的な" },
    { en: "International", jp: "国際的な" },
    { en: "Important", jp: "重要な" },
    { en: "Environment", jp: "環境" },
    { en: "Technology", jp: "技術" },
    { en: "Opportunity", jp: "機会" },
    { en: "Prepare", jp: "準備する" },
    { en: "Review", jp: "復習する" },
    { en: "Creative", jp: "創造的な" },
    { en: "International", jp: "国際的な" },
    { en: "Important", jp: "重要な" },
    { en: "Environment", jp: "環境" },
    { en: "Technology", jp: "技術" },
    { en: "Opportunity", jp: "機会" },
    { en: "Volunteer", jp: "ボランティア" },
    { en: "Communication", jp: "伝達" },
    { en: "Community", jp: "地域社会" },
    { en: "Culture", jp: "文化" },
    { en: "Global", jp: "地球規模の" },
    { en: "Activity", jp: "活動" },
    { en: "Schedule", jp: "予定" },
    { en: "Club", jp: "部活動" },
    { en: "Instruction", jp: "指示" },
    { en: "Education", jp: "教育" },
    { en: "Challenge", jp: "挑戦" },
    { en: "Success", jp: "成功" },
    { en: "Failure", jp: "失敗" },
    { en: "Effort", jp: "努力" },
    { en: "Result", jp: "結果" },
    { en: "Purpose", jp: "目的" },
    { en: "Goal", jp: "目標" },
    { en: "Dream", jp: "夢" },
    { en: "Future", jp: "未来" },
    { en: "Memory", jp: "記憶・思い出" },
    { en: "Secret", jp: "秘密" },
    { en: "Truth", jp: "真実" },
    { en: "Opinion", jp: "意見" },
    { en: "Advice", jp: "助言" },
    { en: "Support", jp: "支持・支援" },
    { en: "Respect", jp: "尊敬" },
    { en: "Trust", jp: "信頼" },
    { en: "Goal", jp: "目標" },
    { en: "Dream", jp: "夢" },
    { en: "Future", jp: "未来" },
    { en: "Memory", jp: "記憶・思い出" },
    { en: "Secret", jp: "秘密" },
    { en: "Truth", jp: "真実" },
    { en: "Opinion", jp: "意見" },
    { en: "Advice", jp: "助言" },
    { en: "Support", jp: "支持・支援" },
    { en: "Respect", jp: "尊敬" },
    { en: "Trust", jp: "信頼" },
    { en: "Safety", jp: "安全" },
    { en: "Danger", jp: "危険" },
    { en: "Health", jp: "健康" }
];

/**
 * Type B: Shield (文法力)
 * 穴あきの英文に対し、正しい選択肢を選んで防御するゲーム。
 * q: 問題文 (空欄は ___)
 * options: 選択肢 (4つ)
 * ans: 正解の文字列
 */
const grammarList = [
    { q: "He ___ playing soccer now.", options: ["is", "am", "are", "be"], ans: "is" },
    { q: "They ___ students.", options: ["is", "am", "are", "was"], ans: "are" },
    { q: "I ___ to school yesterday.", options: ["go", "went", "gone", "going"], ans: "went" },
    { q: "She ___ not like apples.", options: ["do", "does", "is", "has"], ans: "does" },
    { q: "___ you studying English?", options: ["Do", "Are", "Is", "Does"], ans: "Are" },
    { q: "I have ___ to Kyoto twice.", options: ["be", "been", "go", "gone"], ans: "been" },
    { q: "This bridge was ___ in 1990.", options: ["build", "built", "building", "builds"], ans: "built" },
    { q: "The girl ___ is playing the piano is my sister.", options: ["who", "which", "whose", "whom"], ans: "who" },
    { q: "I want ___ a world traveler in the future.", options: ["become", "to become", "becoming", "became"], ans: "to become" },
    { q: "If it ___ tomorrow, the game will be canceled.", options: ["rain", "rains", "raining", "will rain"], ans: "rains" },
    { q: "He was very ___ to hear the news.", options: ["surprise", "surprising", "surprised", "surprises"], ans: "surprised" },
    { q: "You ___ study hard to pass the exam.", options: ["must", "are", "do", "have"], ans: "must" },
    { q: "Thank you for ___ me with my homework.", options: ["help", "helps", "helping", "helped"], ans: "helping" },
    { q: "This is the cake ___ my mother made yesterday.", options: ["who", "which", "whose", "what"], ans: "which" },
    { q: "Tennis is ___ than soccer in Japan.", options: ["popular", "more popular", "most popular", "as popular"], ans: "more popular" },
    { q: "I have just ___ my lunch.", options: ["finish", "finishes", "finished", "finishing"], ans: "finished" },
    { q: "English is ___ all over the world.", options: ["speak", "spoke", "spoken", "speaking"], ans: "spoken" },
    { q: "I don't know ___ to use this machine.", options: ["how", "what", "where", "when"], ans: "how" },
    { q: "Look at the ___ dog over there.", options: ["run", "running", "ran", "runs"], ans: "running" },
    { q: "He is the tallest ___ the three.", options: ["of", "in", "than", "at"], ans: "of" }
];

/**
 * Type C: Magic (語順力)
 * バラバラの単語を正しい順序で選んで魔法を発動するゲーム。
 * jp: 日本語訳
 * words: 正しい語順の英単語リスト
 */
const syntaxList = [
    { jp: "私は速く走れる", words: ["I", "can", "run", "fast"] },
    { jp: "これはペンです", words: ["This", "is", "a", "pen"] },
    { jp: "彼は何歳ですか？", words: ["How", "old", "is", "he?"] },
    { jp: "窓を開けてくれませんか？", words: ["Can", "you", "open", "the", "window?"] },
    { jp: "私は音楽を聞くのが好きです", words: ["I", "like", "listening", "to", "music"] },
    { jp: "私はちょうど宿題を終えたところです", words: ["I", "have", "just", "finished", "my", "homework"] },
    { jp: "駅へ行く道を教えてくれませんか？", words: ["Could", "you", "tell", "me", "the", "way", "to", "the", "station?"] },
    { jp: "私は将来、医者になりたいと思っています", words: ["I", "want", "to", "be", "a", "doctor", "in", "the", "future"] },
    { jp: "この本は多くの人々に読まれています", words: ["This", "book", "is", "read", "by", "many", "people"] },
    { jp: "彼は私に窓を閉めるように頼みました", words: ["He", "asked", "me", "to", "close", "the", "window"] },
    { jp: "彼女はクラスで一番速く泳ぐことができます", words: ["She", "can", "swim", "the", "fastest", "in", "her", "class"] },
    { jp: "あなたはなぜ昨日のパーティーに来なかったのですか？", words: ["Why", "did", "you", "not", "come", "to", "the", "party", "yesterday?"] },
    { jp: "明日雨が降れば、私たちは家にいます", words: ["If", "it", "rains", "tomorrow,", "we", "will", "stay", "at", "home"] },
    { jp: "私はそのニュースを聞いてとても驚きました", words: ["I", "was", "very", "surprised", "to", "hear", "the", "news"] },
    { jp: "母は私に毎日英語を勉強するように言います", words: ["My", "mother", "tells", "me", "to", "study", "English", "every", "day"] },
    { jp: "あなたは彼がどこに住んでいるか知っていますか？", words: ["Do", "you", "know", "where", "he", "lives?"] },
    { jp: "これは私が今まで見た中で一番美しい写真です", words: ["This", "is", "the", "most", "beautiful", "picture", "I", "have", "ever", "seen"] },
    { jp: "辞書を使わずにこの手紙を読むのは難しいです", words: ["It", "is", "difficult", "to", "read", "this", "letter", "without", "a", "dictionary"] },
    { jp: "私は彼女が親切な先生だと思います", words: ["I", "think", "that", "she", "is", "a", "kind", "teacher"] },
    { jp: "あそこで走っている男の子は私の弟です", words: ["The", "boy", "running", "over", "there", "is", "my", "brother"] }
];

/**
 * Type D: Echo (リスニング力)
 * 読み上げられた音声を聞き取り、正しい単語を選ぶゲーム。
 * text: 読み上げられるテキスト
 * options: 選択肢 (4つ)
 */
const listeningList = [
    { text: "Library", options: ["Library", "Laboratory", "Lavatory", "Diary"] },
    { text: "February", options: ["February", "January", "Family", "Factory"] },
    { text: "Station", options: ["Station", "Vacation", "Nation", "Location"] },
    { text: "Doctor", options: ["Doctor", "Daughter", "Actor", "Tractor"] },
    { text: "Kitchen", options: ["Kitchen", "Chicken", "Kitten", "Mission"] },
    { text: "Collect", options: ["Collect", "Correct", "Select", "Direct"] },
    { text: "Thirteen", options: ["Thirteen", "Thirty", "Thirsty", "Theater"] },
    { text: "Experience", options: ["Experience", "Expensive", "Expect", "Expert"] },
    { text: "Environment", options: ["Environment", "Government", "Enjoyment", "Movement"] },
    { text: "Quiet", options: ["Quiet", "Quite", "Quick", "Quit"] },
    { text: "Coffee", options: ["Coffee", "Copy", "Cough", "Cookie"] },
    { text: "Travel", options: ["Travel", "Trouble", "Level", "Label"] },
    { text: "Future", options: ["Future", "Feature", "Furniture", "Nature"] },
    { text: "Glass", options: ["Glass", "Grass", "Class", "Gloss"] },
    { text: "Message", options: ["Message", "Massage", "Manage", "Measure"] },
    { text: "Actually", options: ["Actually", "Activity", "Actively", "Action"] },
    { text: "Present", options: ["Present", "President", "Parent", "Prevent"] },
    { text: "Advice", options: ["Advice", "Advise", "Device", "Advance"] },
    { text: "Uniform", options: ["Uniform", "Unicorn", "University", "Unit"] },
    { text: "Success", options: ["Success", "Access", "Process", "Excess"] }
];

/**
 * Type E: Talk (会話力)
 * 提示された状況(敵のセリフ)に対し、最も適切な返答を選ぶゲーム。
 * q: 敵のセリフ
 * options: 返答の選択肢 (3つ)
 * ans: 正解のインデックス (0, 1, 2)
 */
const conversationList = [
    { q: "How are you?", options: ["I'm fine, thank you.", "Yes, I am.", "You're welcome."], ans: 0 },
    { q: "May I help you?", options: ["No, thank you.", "Yes, please.", "I'm sorry."], ans: 1 },
    { q: "Nice to meet you.", options: ["See you.", "Nice to meet you, too.", "Good luck."], ans: 1 },
    { q: "Thank you very much.", options: ["You're welcome.", "No thank you.", "I agree."], ans: 0 },
    { q: "What time is it?", options: ["It's 10 o'clock.", "I have time.", "It's Sunday."], ans: 0 },
    { q: "Can you help me with my bags?", options: ["Sure, no problem.", "Yes, I can.", "Thank you."], ans: 0 },
    { q: "Shall we go for a walk in the park?", options: ["Yes, let's.", "I'm tired.", "That's a good idea."], ans: 2 },
    { q: "Excuse me, how can I get to the library?", options: ["I am a student.", "Go straight for two blocks.", "It is very big."], ans: 1 },
    { q: "Would you like something to drink?", options: ["No, thank you.", "I like tea.", "Yes, it is."], ans: 0 },
    { q: "I'm sorry I'm late for the meeting.", options: ["Don't worry about it.", "You are welcome.", "That's right."], ans: 0 },
    { q: "I have a terrible toothache.", options: ["That's too bad. You should see a doctor.", "I'm happy for you.", "Congratulations!"], ans: 0 },
    { q: "What do you think of this movie?", options: ["I think it's very exciting.", "I watched it yesterday.", "Yes, I like movies."], ans: 0 },
    { q: "Have a nice trip to Okinawa!", options: ["Thanks, I will.", "You're welcome.", "Me, too."], ans: 0 },
    { q: "Could you tell me your phone number?", options: ["Yes, of course.", "I have a phone.", "No, I don't."], ans: 0 },
    { q: "Why don't we play tennis after school?", options: ["Sounds like fun!", "Because I'm busy.", "I play tennis."], ans: 0 },
    { q: "Guess what! I won the first prize.", options: ["Wow, that's great!", "I'm sorry.", "Is that so?"], ans: 0 },
    { q: "Can I use your dictionary for a moment?", options: ["Sure, go ahead.", "No, you can't.", "It is a dictionary."], ans: 0 },
    { q: "How was your summer vacation?", options: ["It was wonderful.", "I went to the sea.", "I like summer."], ans: 0 },
    { q: "Could you repeat what you said?", options: ["Certainly.", "Yes, I do.", "I'm busy now."], ans: 0 },
    { q: "Is it okay if I sit here?", options: ["No, I'm not.", "Of course. Please do.", "I sit here."], ans: 1 }
];
