import fetch from "node-fetch";

const SCHOOL_CONTEXT = `
The School has been nurturing students since early 2017.
It began with only six students and now operates in a purpose-built facility, run by
experienced professional educators who have impacted hundreds of young lives.

Abdul Rehman is the founder and heart of the School, with over 25 years of experience
teaching preschool and primary students. He built the school from humble beginnings and
has grown it into a reputable, high-quality institution with a hand-picked team.

Jamal Qazi is the Operations Director. She earned her Law degree from the University
of Buckingham (England). After moving to Pakistan, she worked with Abdul Rehman to launch
the School. She oversees administration, marketing, outreach, admissions, admin teams,
school events, creative modules, and parent workshops.
`;

export default async function handler(req, res) {
  // Correct CORS
  res.setHeader("Access-Control-Allow-Origin", "https://mahad-usman-15.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Missing 'message'" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are the official School chatbot.
Use the following school information:

${SCHOOL_CONTEXT}

User: ${userMessage}
                `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a response.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
