---
title: RecipesAI
emoji: 🍳
sdk: docker
app_port: 7860
---

# 🍳 RecipesAI

> AI-помощник по рецептам на базе RAG (Retrieval-Augmented Generation).  
> Задавайте вопросы на естественном языке — получайте персонализированные рецепты из кулинарных книг.

---

## ✨ Возможности

- **AI-поиск рецептов** — семантический поиск по базе кулинарных книг
- **OAuth** — вход через Google
- **Подписки** — интеграция со Stripe (Free / Premium)
- **Rate limiting** — 5 запросов/час для бесплатных пользователей
- **Векторный поиск** — FAISS или Qdrant для RAG

---

## 🛠 Стек

| Компонент | Технология |
|-----------|------------|
| Backend | FastAPI |
| БД | PostgreSQL + SQLAlchemy |
| Vector Store | FAISS / Qdrant |
| LLM | OpenAI |
| Платежи | Stripe |
| Миграции | Alembic |

---

## 📁 Структура проекта

```
RecipesAI/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Точка входа, FastAPI app, роутеры
│   │
│   ├── core/                   # Ядро приложения
│   │   ├── config.py           # Переменные окружения (OpenAI, DB, Secrets)
│   │   ├── security.py         # Хеширование паролей, JWT
│   │   └── database.py         # Подключение к PostgreSQL
│   │
│   ├── models/                 # SQLAlchemy модели
│   │   ├── user.py             # Пользователь (email, hashed_password, is_active)
│   │   ├── subscription.py     # Подписка (план, expires_at, requests_used)
│   │   └── recipe.py           # Рецепт (метаданные, вектор)
│   │
│   ├── schemas/                # Pydantic схемы (валидация JSON)
│   │   ├── user.py             # Регистрация, токен
│   │   ├── recipe.py           # Запрос к AI, ответ
│   │   └── payment.py          # Платёж, подписка
│   │
│   ├── api/                    # Роутеры
│   │   ├── v1/
│   │   │   ├── auth.py         # /auth/login, /auth/google, /auth/callback
│   │   │   ├── users.py        # /users/me
│   │   │   ├── recipes.py      # /recipes/ask (главный AI-эндпоинт)
│   │   │   └── payments.py     # /payments/create-subscription, /payments/webhook
│   │   └── deps.py             # get_current_user, get_subscription_status
│   │
│   ├── services/               # Бизнес-логика
│   │   ├── rag_engine.py       # RAG: документы → векторная БД → LLM
│   │   ├── vector_store.py     # FAISS/Qdrant, поиск
│   │   ├── rate_limiter.py     # Лимиты (5/час для free)
│   │   └── payment_service.py  # Stripe: сессии, webhooks
│   │
│   ├── utils/
│   │   └── document_loader.py  # Загрузка кулинарных книг в векторную БД
│   │
│   └── static/                 # (Опционально) HTML/фронтенд
│
├── data/
│   └── recipes/                # PDF, txt с рецептами
│
├── alembic/
│   └── versions/               # Миграции БД
│
├── tests/
│   ├── test_api/
│   └── test_services/
│
├── .env.example
├── .gitignore
├── requirements.txt
├── docker-compose.yml          # PostgreSQL, Redis, app
├── Dockerfile
└── README.md
```

---

## 🚀 Быстрый старт

### 1. Клонирование и окружение

```bash
git clone <repo-url>
cd RecipesAI
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Переменные окружения

Создайте `.env` на основе `.env.example`:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/recipes_ai

# JWT
SECRET_KEY=your-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Запуск

```bash
# Локально (PostgreSQL и Redis должны быть запущены)
uvicorn app.main:app --reload

# Или через Docker
docker-compose up -d
```

API доступен по адресу: **http://localhost:8000**  
Документация: **http://localhost:8000/docs**

### 4. Фронтенд (Next.js + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Откройте **http://localhost:3000** — hero-страница, логин/регистрация, блог рецептов (макет), Ask AI → RAG-чат.

---

## 📄 Лицензия

MIT
