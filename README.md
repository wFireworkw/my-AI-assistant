# ИИ Помощник

Простой чат-бот с использованием AITunnel API и модели GLM-5.3-Flash.

## Локальная установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example` и добавьте свой API ключ:
```bash
cp .env.example .env
```

4. Отредактируйте `.env` и добавьте ваш AITunnel API ключ:
```
AITUNNEL_API_KEY=your_actual_api_key
PORT=3000
```

## Локальный запуск

```bash
npm start
```

Сервер будет доступен по адресу `http://localhost:3000`

## Деплой на Render

1. Загрузите проект на GitHub
2. Зайдите на [render.com](https://render.com)
3. Создайте новый "Web Service"
4. Подключите ваш GitHub репозиторий
5. В настройках добавьте переменную окружения:
   - Key: `AITUNNEL_API_KEY`
   - Value: ваш настоящий API ключ от AITunnel
6. Render автоматически запустит приложение

## Использование

- Откройте URL вашего приложения (локально или на Render)
- Введите сообщение и нажмите Enter или кнопку отправки
- ИИ ответит на русском языке

## Технологии

- Node.js + Express
- AITunnel API
- GLM-5.3-Flash модель
