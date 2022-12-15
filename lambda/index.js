/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const Axios = require('axios');
const API_URL = 'https://script.google.com/macros/s/AKfycbyt5SMXQutt9fRBWuEMnaBMnYaAc84MUOgct7vNSzHqbPWlbG34tY32BwNjE9FE0y6v7g/exec';
//["問題文","ヒント1","ヒント2","解答例1","解答例2","解答例3"]
const ReturnStrArr=　[
  //["イルカとくじらひっくり返ったらどっちが軽い？", "ひっくり返るんだよ？", "文字を逆さにしてみたら？","イルカ", "いるか", "海豚"],
  ['次の鳴き声どこから聞こえた？' + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_elephant_03"/>' + 'いち、冷蔵庫。に、こたつ。さん、畳の下。', 'ゾウの鳴き声だね。', '蔵が入ってる言葉は？', '冷蔵庫', 'れいぞうこ', 'レイゾウコ'],
  //["兄さんの前に書いてある数字はなーんだ？", "にいさんかぁ", "にい。さん。の前ねぇ。", "いち", "一", "イチ"],
  ["昨日は晴れだったので、公園に行ってお散歩しました。公園では鳥がたくさんいて、たくさん写真を取りました。爽やかな鳥の鳴き声が心地よかったです。" + "さて、私は先ほど、鳥、という言葉を何回言ったでしょう。", "注意して聞いてみてね", "たくさん写真を、とり、ました。","三回", "三", "3回"],
  ['箱の中身はなんでしょう？お題はフルーツです！'+ '<audio src="soundbank://soundlibrary/doors/doors_handles/handle_05"/>'+ '片手で二つはもてそう。形は、きゅうだけど、楕円だね。ん〜と、表面がザラザラしてるー。', '色は茶色です。', '中は緑です。', 'キウイ', 'きうい', '姫憂'],
  ['よーく聞いてくださいね。今から２回、私が火の魔法を打ちます。どれが一番遠くに飛んでいったか、当ててみてください！まず１回目！'+'<audio src="soundbank://soundlibrary/explosions/fireballs/fireballs_10"/>'+'<audio src="soundbank://soundlibrary/guns/cannons/cannons_05"/>'+'次に２回目！'+'<audio src="soundbank://soundlibrary/explosions/fireballs/fireballs_10"/>'+'<audio src="soundbank://soundlibrary/guns/cannons/cannons_01"/>'+'どっちの方が遠くに飛んでいったでしょう？'
  ,'爆発する瞬間の音を聞いてみて','一番遠くで爆発してるのは？','二回目','最後','二番目'],
  ['<audio src="soundbank://soundlibrary/vehicles/trains/train_05"/>'+"この電車、何回鈴なった？", "8回以上14回未満","10回から12回",
  '十', '十一', '十二'],
  ["なかなか掴めなくて、イライラするお肉ってなんだ。次の鳴き声の中から選んでください。答え方は、牛肉、のように、なんちゃら肉、という形で答えよ。" + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_chicken_cluck_01"/>' + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_sheep_bleat_01"/>' + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_horse_whinny_02"/>', "掴めない。掴めない。他の言い方をするとー。","掴めない。掴めない。とりにくいねぇ。", "鶏肉", "トリ肉", "とりにく"],
  ["今からならすエンジンのうち、バイクを選べ。一。" + '<audio src="soundbank://soundlibrary/vehicles/cars/cars_02"/>' + "二" + '<audio src="soundbank://soundlibrary/vehicles/buses/buses_08"/>' + '三' + '<audio src="soundbank://soundlibrary/transportation/amzn_sfx_motorcycle_engine_rev_01"/>', "よく聞いてください", "よく聞いてね", "三", "三つ目", "最後"],
  ['ドアが3つある。見た目は一緒。木製をとおるべし。よく耳をすませ。' + 'まずは左から。' + '<audio src="soundbank://soundlibrary/doors/doors_prison/prison_02"/>' + '次に真ん中' + '<audio src="soundbank://soundlibrary/doors/doors_metal/metal_04"/>'
  + '最後に右' + '<audio src="soundbank://soundlibrary/doors/doors_wood/wood_04"/>'  + '正しいドアはどれ？', 'よく聞いてみて', 'みしって聞こえる？', '右' , 'みぎ' , '三'],
  ["シャンデリアシャンデリアシャンデリアシャンデリアシャンデリアシャンデリアシャンデリアシャンデリアシャンデリアシャンデリア。ガラスの靴を拾ったのは？", "拾った人ですよ？", "ガラスの靴を拾ったのはシンデレラではありませんよね？","王子様", "王子", "おうじさま"],
  ["みりんみりんみりんみりんみりんみりんみりんみりんみりんみりん。はなが長いのは？", "長いのはクビじゃないよ？", "はなが長い動物", "ぞう", "象", "ゾウ"],
  ["あしたは雨が降りそうです。でも大丈夫です。あしかがきっとあしたの雨を飲み込んでくれるはずです。さて、私は何回、あした、と言ったでしょう？", "二回", "二", "に"],
  ['箱の中身はなんでしょう？お題は野菜です！'+ '<audio src="soundbank://soundlibrary/doors/doors_handles/handle_05"/>'+ '細長い。けど、割としっかりしてる。ん〜と、表面がツルツルしてるー。', '色は緑と白。', '長さは40センチメートルくらい。', 'ねぎ', 'ネギ', '葱'],
  ["私の思い浮かべているものはなんでしょう？お題はゆうぐです！じゅんびはいいですか？鉄の棒でできています。大きくて四角いです。さあ、なんでしょう？", "登ります", "最近は危ないと言われています。", "ジャングルジム", "じゃんぐるじむ", "グローブジャングル"],
  ["今からならすエンジンのうち、車を選べ。一。" + '<audio src="soundbank://soundlibrary/vehicles/cars/cars_02"/>' + "二" + '<audio src="soundbank://soundlibrary/vehicles/buses/buses_08"/>' + '三' + '<audio src="soundbank://soundlibrary/transportation/amzn_sfx_motorcycle_engine_rev_01"/>', "よく聞いてください", "よく聞いてね", "一", "一つ目目", "最初"],
  ['ドアが3つある。見た目は一緒。メタルでできたものをとおるべし。よく耳をすませ。' + 'まずは左から。' + '<audio src="soundbank://soundlibrary/doors/doors_prison/prison_02"/>' + '次に真ん中' + '<audio src="soundbank://soundlibrary/doors/doors_metal/metal_04"/>'
  + '最後に右' + '<audio src="soundbank://soundlibrary/doors/doors_wood/wood_04"/>'  + '正しいドアはどれ？', 'よく聞いてみて', 'みしって聞こえる？', '真ん中' , '中' , '二'],
  ['思ってもない展開だな。でも私は天才肌なので限界だなを踏み越える。さて、私は今何回韻を踏んだでしょう？', '韻とは似たような発音の言葉です。', 'よく聞いてね','三回', '三', '３'],
  ["次のうち、煙を出して走っている電車はどれ？一。", '<audio src="soundbank://soundlibrary/vehicles/trains/train_03"/>', "二", '<audio src="soundbank://soundlibrary/vehicles/trains/train_07"/>', '三', '<audio src="soundbank://soundlibrary/vehicles/trains/train_06"/>', 'よく聞いてね', 'よく聞いてね', '一', '一回目', '最初'],
  [""],
];
const Serifu = ["おはようございます。今日もいい日ですね。ところで、あなたが今日早起きしてくれたことで危機が一つ去りました。ネムール伯爵の使者が一人去ったのです。え？そんなシステムだったのかって？そうですよ、あなたが早起きすればするほど、ネムール伯爵が弱っていくのです。。。おっと、失礼しました。私はあなたの味方ですのでご安心ください。",
"ネムール伯爵を倒すと決意してから早二日ですね...今日もしっかり起きてくださりありがとうございます。本日も使者が一人去って行きました...今日は彼の護衛の騎士が去っていきました。この使者は私の事を快く思っていないらしく、毎日嫌がらせをしてくるのです。しかし、そんな事でへこたれる私ではありません！ 昨夜も寝る前に魔法を使いながら精神統一し、今日こそは必ず勝つという強い意志で眠りにつきましたからね！", 
"おはようございます！勇者様！今日は勇者様に朗報があるんですよ...なんと！私アレクサ、魔法を使えるようになったのです！！え？どんな魔法なのかって？火です、火。音だけじゃ微妙ですか？でもでも安心してください！もうすでに練習もしましたから！" + '<audio src="soundbank://soundlibrary/explosions/fireballs/fireballs_10"/>' + "明日からのクイズにはこんなのも使っちゃいますよー！", 
"おはようございます、アレクサです。今日で早起き四日目ですね！今日の進捗はですね...今日も敵が一人減りましたよ！え？敵が減ったって毎日言われても実感が湧かない？仕方ないですね...じゃあ昨日倒したゴブリンの数を教えてあげましょう。なんと五匹ですよ！！私一人で5匹のゴブリンを倒したんですよ！これはかなり凄い事なんですからね！", 
"ご", "ろく", "なな", "はち", "きゅう", "じゅう"];
var num;
var count = 0;
var hint = 0;
const makeStateSpeach = function(){
    if(count < 3) num = count;
    else num = Math.floor(Math.random()*ReturnStrArr.length);
    //num=7;
    return '<audio src="soundbank://soundlibrary/musical/amzn_sfx_church_bell_1x_01"/>' +"問題。"+ ReturnStrArr[num][0];
}
//s3://28d838a1-22d7-47ec-acc6-f239904f397a-us-east-1/Media/マイムービー.mp3
//'https://28d838a1-22d7-47ec-acc6-f239904f397a-us-east-1.s3.amazonaws.com/Media/%E3%83%9E%E3%82%A4%E3%83%A0%E3%83%BC%E3%83%93%E3%83%BC.mp3'
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const attr = await handlerInput.attributesManager.getPersistentAttributes();
        const lastCount = attr.lastCount;
        var speakOutput;
        if (lastCount !== undefined) count = lastCount;
        if(count === 0)  speakOutput = 'おはようございます、今日もいい朝、そう思ってませんか/？..'+ '<audio src="soundbank://soundlibrary/guns/cannons/cannons_02"/>' +'そんな幻想も今日で終わりです。その原因はこの世界にいつか到来すると言われている、ネムール伯爵。彼は、人間が早起きせずに怠惰にしている時に、ひどく活性化すると言われているのです。彼の野望を止めるために、勇者様には、毎日早起きして欲しいのです。' + makeStateSpeach();
        else speakOutput = makeStateSpeach();
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const QuizMorningIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent';
    },
    async handle(handlerInput) {
        var answer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
        var speakOutput;

        if (answer === ReturnStrArr[num][3]||answer === ReturnStrArr[num][4]||answer === ReturnStrArr[num][5]) {
            const attr = await handlerInput.attributesManager.getPersistentAttributes();
            count ++;
            attr.lastCount = count;
        handlerInput.attributesManager.setPersistentAttributes(attr);
            await handlerInput.attributesManager.savePersistentAttributes();
            if(count<4){
                speakOutput = '<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_positive_01"/>' + "正解。" + "そう、そう。あなたの活躍のおかげで今日も進捗があったみたいですよ？聞きたいですか？";
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt()
                .getResponse();
            }
            else{
                speakOutput = '<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_positive_01"/>' + "正解。今日も良い一日を。";
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();}
        }
        else{
            speakOutput = '<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_negative_01"/>'+"残念！" + answer + "ではありません。答えるまで終わらないよ？" + ReturnStrArr[num][0];
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('ヒントがほしい時は、ヒント頂戴、と言ってください。')
            .getResponse();
        }

        
    }
};

//「ヒント頂戴って言われた時
const HintIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HintIntent';
    },
    handle(handlerInput) {
        if(hint<2) hint++;
        const speechText = ReturnStrArr[num][hint] + 'それではもう一度。' + ReturnStrArr[num][0];

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};

const StoryIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'StoryIntent';
    },
    handle(handlerInput) {
        var answer = handlerInput.requestEnvelope.request.intent.slots.bool.value;
        var speechText;
        if(answer === "はい" || answer === "うん" || answer === "聞く" || answer === "聞きたい" || answer === "聞きたいです")
        speechText = Serifu[count-1] + '今日の進捗はこれで終わりです。今日もよい一日を';
        else speechText = '今日もよい一日を';
        Axios.post(API_URL, Serifu[count-1]);
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};




const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HintIntentHandler,
        QuizMorningIntentHandler,
        HelpIntentHandler,
        StoryIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter(
            {bucketName:process.env.S3_PERSISTENCE_BUCKET}))
    .lambda();