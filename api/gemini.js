import fetch from "node-fetch";

const SCHOOL_CONTEXT = `
The School has been nurturing students since early 2017.
It began with only six students and now operates in a purpose-built facility...
`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Missing 'message'" });

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
                { text: `School info:\n${SCHOOL_CONTEXT}\nUser: ${userMessage}` }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();
    return res.json({
      reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate response."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
