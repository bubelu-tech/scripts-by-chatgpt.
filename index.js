import express from “express”;

const app = express();
app.use(express.json({ limit: “32kb” }));

app.get(”/”, (req, res) => {
res.json({
status: “online”,
name: “Scripts by ChatGPT”
});
});

app.post(”/chat”, async (req, res) => {
try {
const key = process.env.OPENAI_API_KEY;

    if (!key) {
        return res.status(500).json({
            error: "API-Key fehlt auf dem Server."
        });
    }
    const response = await fetch(
        "https://api.openai.com/v1/responses",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-5-mini",
                instructions: "Du bist ChatGPT. Antworte hilfreich auf Deutsch. Du kannst Fragen beantworten und Roblox-Lua-Code für legitime Roblox-Studio-Projekte erstellen.",
                input: req.body.messages
            })
        }
    );
    const data = await response.json();
    if (!response.ok) {
        return res.status(response.status).json({
            error: data.error?.message || "KI-Fehler"
        });
    }
    res.json({
        answer: data.output_text || "Keine Antwort erhalten."
    });
} catch (error) {
    res.status(500).json({
        error: error.message
    });
}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, “0.0.0.0”, () => {
console.log(“Scripts by ChatGPT läuft!”);
});
