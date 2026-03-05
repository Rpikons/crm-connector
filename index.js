const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

async function saveToNotion(nome, email, budget) {
    // NOTA: Verifica che questi nomi corrispondano ESATTAMENTE alle tue colonne Notion
    return axios.post('https://api.notion.com/v1/pages', {
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
            'Nome': { title: [{ text: { content: nome } }] },
            'Email': { email: email },
            'Budget': { select: { name: budget } }
        }
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.NOTION_KEY}`,
            'Notion-Version': '2022-06-28'
        }
    });
}

app.post('/api/lead', async (req, res) => {
    console.log("📩 Richiesta ricevuta per:", req.body.email);
    try {
        await saveToNotion(req.body.nome, req.body.email, req.body.rispostaQuiz);
        console.log("✅ Salvato su Notion!");
        res.json({ success: true });
    } catch (error) {
        const errorMsg = error.response ? error.response.data.message : error.message;
        console.error("❌ Errore Notion:", errorMsg);
        res.status(500).json({ success: false, message: errorMsg });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server pronto su http://localhost:${PORT}`));
