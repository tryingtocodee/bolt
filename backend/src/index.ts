import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"
import express from "express"

dotenv.config()
const gemini = process.env.GEMINI_KEY


const app = express()
const port = process.env.PORT

//gemini api interaction
//@ts-ignore
const genAI = new GoogleGenerativeAI(gemini)
const model = genAI.getGenerativeModel({model:"gemini-1.5-flash" , systemInstruction:"You build websites for react and node.js"})
const prompt = "write 30 words about ai development"


app.get("/template" ,  async(req , res) =>{
    const prompt = req.body.prompt

    const chat = model.startChat({
        history:[]
    })


    let result = await chat.sendMessageStream(prompt)
    for await (const chunk of result.stream){
        const chunkText = chunk.text()

        if(chunkText !== "react" || "node"){
            
        }
    }

})

async function runGemini (){
    try{
        //this is to generate content 
        //const result = await model.generateContent(prompt )
        //const response =  result.response.text()
        
        const result = await model.generateContentStream(prompt)

        for await ( const chunk of result.stream){
            const chunkText = chunk.text()
            process.stdout.write(chunkText)
        }
    
        //console.log("response" , response)
    }catch(e : any){
        console.log("error in rungemini function" , e.message)
    }
} 

runGemini()
console.log(gemini)


app.listen(port , ()=>{
    console.log("server" , port)
})