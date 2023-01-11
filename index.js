const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const openai = require('openai');
const cors = require('cors')
require('dotenv').config();

app.use(express.json());
app.use(cors())


let HEADERS = {
    'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
    'Content-Type': 'application/json'
}


const configuration = new openai.Configuration({
    organization: process.env.ORGANIZATION_KEY,
    apiKey: process.env.CHATGPT_API_KEY
});
const openAiApi = new openai.OpenAIApi(configuration);

const generatePrompt = (topic, subTopic) => {
    return `Create a blog on ${topic}, where it tells deeply about ${subTopic}`
}

app.get('/',(req,res)=> {
    res.send('Welcome to the chatgpt server');
});

app.post('/getchatgpt', async (req,res)=> {
    if (!configuration.apiKey) {
        res.status(401).json({
            message: "Please Configure Your OpenAi Api , In order to make requests"
        });
        return;
    }
    

     if (!req.body.topic || !req.body.subTopic) {
        res.status(400).json({
            message: "Topic or Subtopic is required to get the desired output"
        })
    }
    try {
        const completion = await openAiApi.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(req.body.topic, req.body.subTopic),
            temperature: 0.5,
            max_tokens: 750
          });
          res.status(200).json({
            data: completion.data.choices[0].text,
            message:"Fetched Successfully"
          })
    } catch(e){
        res.status(400).json({
            messages: 'Something went wrong, Please try again later.',
            error: e
        })
    }
})

app.listen(PORT, ()=> {
    console.log(`server is listening on ${PORT} `);
})