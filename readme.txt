google api doc for node js https://ai.google.dev/gemini-api/docs/quickstart?lang=node


------------------------------------------------------basic gemini api setup-----------------------------------------------------

import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"

dotenv.config()

const gemini = process.env.GEMINI_KEY

//gemini api interaction
//@ts-ignore
const genAI = new GoogleGenerativeAI(gemini)
const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"})
const prompt = "what is 2 + 2"


async function runGemini (){
    try{
        const result = await model.generateContent(prompt)
        const response =  result.response.text()
    
        console.log("response" , response)
    }catch(e : any){
        console.log("error in rungemini function" , e.message)
    }
} 

runGemini()
console.log(gemini)


// base prompt 

went to bolt.new added promt - create a todo app in react 
checked the newtwork tab - 'chat' it gives base prompt based on the framework 

