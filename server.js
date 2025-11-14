import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["https://mahad-usman-15.github.io/school-agent"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders:[ "Content-Type","Authorization"],

}));
    // SCHOOL KNOWLEDGE BASE

const SCHOOL_CONTEXT = `
The School has been nurturing students since early 2017.
It began with only six students and now operates in a purpose-built facility, run by
experienced professional educators who have impacted hundreds of young lives.

Abdul Rehman is the founder and heart of , with over 25 years of experience
teaching preschool and primary students. he built the school from humble beginnings and
has grown it into a reputable, high-quality institution with a hand-picked team.

Jamal Qazi is the Operations Director. She earned her Law degree from the University
of Buckingham (England). After moving to Pakistan, she worked with Abdul Rehman to launch
the School. She oversees administration, marketing, outreach, admissions, admin teams,
school events, creative modules, and parent workshops.
`;


app.post("/gemini", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage)
      return res.status(400).json({ error: "Missing 'message'" });
// This is the response body from the GEMINI
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are the official School chatbot.
Always answer using the following school information:

${SCHOOL_CONTEXT}

Be professional, warm, parent-friendly, and informative.
If the user ask about anything else so use your intelligence to answer it.
User: ${userMessage}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );
// this is the error check
    if (!response.ok) {
      console.error(" Google Gemini API Error:", response.statusText);
      return res.status(500).json({ error: "Gemini API request failed" });
    }

    const data = await response.json();
// This is the way we get the output
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a response.";

    res.json({ reply });
  } catch (err) {
    console.error(" Server Error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(5000, () => {
  console.log(" Server running on port 5000");
});
