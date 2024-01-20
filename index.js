const express = require("express");
const cors = require("cors");
const { Connection } = require("./db");

require("dotenv").config();
const OpenAI = require("openai");
const { userRoute } = require("./Routes/UserRoute");
const { transRoute } = require("./Routes/TransRoute");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/trans", transRoute);

const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const { input } = req.body;

    const response = await main(input);

    let data = response[0].message.content;

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

async function main(input) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content: `act as a Integrate a chatbot for Mobile banking and chat with user
    based on querry and try to solve the issue and help them to find the solution of them querry here is the prompt ,  
    user querry ${input} output should be less then 30 words `,
      },
    ],
    model: "gpt-3.5-turbo", //it will be costly to use
    // model:'GPT-3',
  });

  return chatCompletion.choices;
}

app.get("/", (req, res) => {
  res.send("Welcome to the Backend of Mobile Banking");
});

app.listen(process.env.port, async () => {
  try {
    await Connection;
    console.log("Connected to Database");
    console.log(`Running at port ${process.env.port}`);
  } catch (error) {
    console.log("Something Went Wrong");
  }
});
