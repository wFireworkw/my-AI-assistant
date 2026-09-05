require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
if (!process.env.AITUNNEL_API_KEY) {
    console.error('ОШИБКА: AITUNNEL_API_KEY не найден в .env файле');
    process.exit(1);
}
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model = 'gpt-4o-mini' } = req.body;
        console.log('Получен запрос от клиента:', { messageCount: messages.length, model });
        const response = await fetch('https://api.aitunnel.ru/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AITUNNEL_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: 2000,
                temperature: 0.7
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка AITunnel API:', response.status, errorText);
            return res.status(response.status).json({ 
                error: `Ошибка API: ${response.status}`,
                details: errorText 
            });
        }
        const data = await response.json();
        console.log('Успешный ответ от AITunnel API');
        res.json(data);
    } catch (error) {
        console.error('Ошибка сервера:', error);
        res.status(500).json({ 
            error: 'Внутренняя ошибка сервера',
            details: error.message 
        });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ИИ помошник.html'));
});
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('ИИ помощник готов к работе!');
});