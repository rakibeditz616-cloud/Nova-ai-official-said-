module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server API key is not configured" });
  }

  try {
    const { model, messages } = req.body || {};
    const allowedModels = [
      "google/gemini-2.5-flash",
      "openai/gpt-4o-mini"
    ];

    if (!allowedModels.includes(model) || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server request failed" });
  }
};
