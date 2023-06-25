const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//send text request to OpenAI and receives a response back
app.post('/api/voice', async (req, res) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": req.body.text}],
      temperature: 0.6,
      max_tokens: 200,
    });

    res.status(200).json({ result: completion.data.choices[0] });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`There is an error occured with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'There is an error occured during your request.',
        }
      });
    }
  }
})


app.listen(8800,()=>{
  console.log("Backend Server is Running......")
  })