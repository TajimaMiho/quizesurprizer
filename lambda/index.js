/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const ReturnStrArr=　[
  ["イルカとくじらひっくり返ったらどっちが軽い？", "ひっくり返るんだよ？", "文字を逆さにしてみたら？","イルカ", "いるか", "海豚"],
  ["兄さんの前に書いてある数字はなーんだ？", "にいさんかぁ", "にい。さん。の前ねぇ", "いち", "一", "イチ"],
  ["なかなか掴めなくてイライラするお肉ってなんだ", "掴めない。掴めない。他の言い方をするとー。","掴めない。掴めない。とりにくいねぇ", "鶏肉", "トリ肉", "とりにく"]
];
const Serifu = ["いち", "に", "さん", "し", "ご", "ろく", "なな", "はち", "きゅう", "じゅう"];
var num;
var count = 0;
var hint = 0;
const makeStateSpeach = function(){
    num = Math.floor(Math.random()*ReturnStrArr.length);
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
        if (lastCount !== undefined) count = lastCount;
        const speakOutput = makeStateSpeach();
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const QuizMorningIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent';
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
            speakOutput = '<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_positive_01"/>'+"正解。"+Serifu[count-1];
            return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
        }
        else{
            speakOutput = '<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_negative_01"/>'+"残念！" + answer + "ではありません。答えるまで終わらないよ？";
            hint++;
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(ReturnStrArr[num][hint])
            .getResponse();
        }

        
    }
};
//「もう一度問題を言って」と言われた時のコード(明日作る)
const QuizHelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'QuizHelpIntent';
    },
    handle(handlerInput) {
        var quizHelp = handlerInput.requestEnvelope.request.intent.slots.quizHelp.value;

        var speakOutput;
        speakOutput=makeStateSpeach();
        
            return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
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
        QuizMorningIntentHandler,
        QuizHelpIntentHandler,
        HelpIntentHandler,
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