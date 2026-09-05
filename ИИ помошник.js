const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
let messageHistory = [
    { role: 'system', content: 'Ты полезный ИИ помощник, который отвечает на вопросы пользователя на русском языке.' }
];
const SERVER_CONFIG = {
    apiUrl: '/api/chat',
    model: 'glm-5.3-flash'
};
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function addLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message loading-message';
    loadingDiv.id = 'loadingIndicator';
    const loadingContent = document.createElement('div');
    loadingContent.className = 'message-content';
    loadingContent.innerHTML = '<span class="loading-dots">Пишу</span>';
    loadingDiv.appendChild(loadingContent);
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}
async function getAIResponse(userMessage) {
    try {
        console.log('Отправка запроса к локальному серверу...');
        messageHistory.push({ role: 'user', content: userMessage });
        const requestBody = {
            model: SERVER_CONFIG.model,
            messages: messageHistory
        };
        console.log('Тело запроса:', requestBody);
        const response = await fetch(SERVER_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });  
        console.log('Статус ответа:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка сервера:', errorData);
            throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
        }
        const data = await response.json();
        console.log('Ответ от сервера:', data);
        
        const aiMessage = data.choices[0].message.content;
        messageHistory.push({ role: 'assistant', content: aiMessage });
        return aiMessage;
    } catch (error) {
        console.error('Ошибка при получении ответа:', error);
        return `Ошибка: ${error.message}. Убедитесь, что сервер запущен.`;
    }
}
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') {
        return;
    }
    addMessage(message, true);
    userInput.value = '';
    addLoadingIndicator();
    const aiResponse = await getAIResponse(message);
    removeLoadingIndicator();
    addMessage(aiResponse, false);
}
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
userInput.focus();
const greetingMessage = 'Привет! Я твой ИИ помощник. Чем могу помочь?';
addMessage(greetingMessage, false);
messageHistory.push({ role: 'assistant', content: greetingMessage });