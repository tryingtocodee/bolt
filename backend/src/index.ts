import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"
import express from "express"
import { basePrompt as nodeBasePrompt } from "./default/node"
import { basePrompt as reactBasePrompt } from "./default/react"
import { BASE_PROMPT  , getSystemPrompt} from "./prompts"


dotenv.config()
const gemini = process.env.GEMINI_KEY


const app = express()
app.use(express.json())
const port = process.env.PORT

//gemini api interaction
//@ts-ignore
const genAI = new GoogleGenerativeAI(gemini)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Your VERY FIRST response MUST be ONLY ONE of the following, with NO other text or explanation: 'react project', 'node project', or 'react project with node'.  Do not provide any other output until after this initial response. After this initial response, you can provide more details if requested."
})

//@ts-ignore
app.post("/template", async (req, res) => {
    try {
        const prompt = req.body.prompt
        prompt.toLowerCase()

        if (!prompt) {
            return res.status(400).json("prompt is required")
        }
        const chat = model.startChat({
            history: []
        })

        let firstResponse = ""
        let isFirstResponse = true
        const validResponses = ["react project", "node project", "react project with node"];
        let result = await chat.sendMessageStream(prompt)
        for await (const chunk of result.stream) {
            const chunkText = chunk.text()

            // created first response variable so we only validate the first reponse the model gives . if we dont use this we will try to validate every response the model gives 


            if (isFirstResponse) {
                firstResponse += chunkText

                if (firstResponse.trim().length >= 20) {
                    const trimmedResponse = firstResponse.trim().toLowerCase()
                    //@ts-ignore
                    // error in this section 
                    if (trimmedResponse.includes(validResponses)) {
                        isFirstResponse = false
                        process.stdout.write(firstResponse)
                    } else {
                        console.log("failed to get corrrect response")
                        return res.json("Invalid first response from gemini")
                    }
                }
            }
        }
    } catch (e: any) {
        console.log("error in /template", e.message)
        return res.json("internal server error")
    }

})
console.log(gemini)
app.listen(port, () => {
    console.log("server", port)
})