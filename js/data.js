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
    { en: "Semester", jp: "学期" }
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
    { q: "___ you studying English?", options: ["Do", "Are", "Is", "Does"], ans: "Are" }
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
    { jp: "私は音楽を聞くのが好きです", words: ["I", "like", "listening", "to", "music"] }
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
    { text: "Kitchen", options: ["Kitchen", "Chicken", "Kitten", "Mission"] }
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
    { q: "Thank you very much.", options: ["You're welcome.", "No problem.", "I agree."], ans: 0 },
    { q: "What time is it?", options: ["It's 10 o'clock.", "I have time.", "It's Sunday."], ans: 0 }
];
