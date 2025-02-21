"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const gemini = process.env.GEMINI_KEY;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT;
//gemini api interaction
//@ts-ignore
const genAI = new generative_ai_1.GoogleGenerativeAI(gemini);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Your VERY FIRST response MUST be ONLY ONE of the following, with NO other text or explanation: 'react project', 'node project', or 'react project with node'.  Do not provide any other output until after this initial response. After this initial response, you can provide more details if requested."
});
//@ts-ignore
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const prompt = req.body.prompt;
        prompt.toLowerCase();
        if (!prompt) {
            return res.status(400).json("prompt is required");
        }
        const chat = model.startChat({
            history: []
        });
        let firstResponse = "";
        let isFirstResponse = true;
        const validResponses = ["react project", "node project", "react project with node"];
        let result = yield chat.sendMessageStream(prompt);
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                const chunkText = chunk.text();
                // created first response variable so we only validate the first reponse the model gives . if we dont use this we will try to validate every response the model gives 
                if (isFirstResponse) {
                    firstResponse += chunkText;
                    if (firstResponse.trim().length >= 20) {
                        const trimmedResponse = firstResponse.trim().toLowerCase();
                        //@ts-ignore
                        // error in this if section 
                        if (trimmedResponse.includes(validResponses)) {
                            isFirstResponse = false;
                            process.stdout.write(firstResponse);
                        }
                        else {
                            console.log("failed to get corrrect response");
                            return res.json("Invalid first response from gemini");
                        }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (e) {
        console.log("error in /template", e.message);
        return res.json("internal server error");
    }
}));
console.log(gemini);
app.listen(port, () => {
    console.log("server", port);
});
