import express from 'express'
const PORT = process.env.PORT || 5000;
import { Configuration, OpenAIApi } from 'openai';
import cors from 'cors'
import * as dotenv from 'dotenv'


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())


const configuration = new Configuration({
    organization: process.env.ORGANIZATION_KEY,
    apiKey: process.env.CHATGPT_API_KEY
});
const openAiApi = new OpenAIApi(configuration);

const generatePrompt = (topic, subTopic) => {
    return `Write a blog about ${topic} which has content related to ${subTopic}.
        Blog should be well written with all the facts and knowledge about ${subTopic}.
        Write 800 characters in a blog.
        `
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
            temperature: 0,
            max_tokens: 2500
          });
          res.status(200).json({
            data: completion.data.choices[0].text
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