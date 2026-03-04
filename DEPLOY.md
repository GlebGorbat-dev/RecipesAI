# Инструкция по деплою

## Архитектура

- **Backend (FastAPI)** → Hugging Face Spaces (Docker)
- **Frontend (Next.js)** → GitHub Pages (статический экспорт)

---

## 1. Backend на Hugging Face Spaces

### Шаги

1. Создай Space на [huggingface.co/spaces](https://huggingface.co/spaces)
2. Тип: **Docker**
3. Клонируй Space и скопируй в него:
   - `Dockerfile`
   - `requirements.txt`
   - `app/`
   - `data/` (с рецептами и faiss_index)
   - `README.md` (с YAML frontmatter для HF)
4. Залий изменения в Space (`git push`)

### Secrets в настройках Space

| Secret | Описание |
|--------|----------|
| `DATABASE_URL` | PostgreSQL (Neon, Supabase, Railway и т.п.) |
| `SECRET_KEY` | JWT secret |
| `OPENAI_API_KEY` | OpenAI API key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_ID_PREMIUM` | Price ID премиум-подписки |
| `GOOGLE_CLIENT_ID` | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `FRONTEND_URL` | URL фронтенда, напр. `https://username.github.io/RecipesAI` |

### После деплоя

- API: `https://YOUR_USERNAME-RecipesAI.hf.space`
- Stripe webhook: `https://YOUR_USERNAME-RecipesAI.hf.space/api/v1/payments/webhook`
- В Google OAuth Console добавь Authorized redirect URI: `https://username.github.io/RecipesAI/auth/google/callback` (страница, куда Google редиректит после логина)

---

## 2. Frontend на GitHub Pages

### Шаги

1. **Settings → Pages**  
   - Source: GitHub Actions

2. **Settings → Secrets and variables → Actions**  
   Добавь:
   - `NEXT_PUBLIC_API_URL` = `https://YOUR_USERNAME-RecipesAI.hf.space`
   - `NEXT_PUBLIC_BASE_PATH` = `/RecipesAI` (если репо `RecipesAI` и URL `username.github.io/RecipesAI`)

   Для user/org site (`username.github.io`):
   - `NEXT_PUBLIC_BASE_PATH` = `` (пустое значение)

3. Закоммить и запушь в `main` — workflow соберёт и задеплоит.

### URL

- Проект: `https://username.github.io/RecipesAI`
- User site: `https://username.github.io`

---

## 3. Проверка

- [ ] PostgreSQL доступен с интернета
- [ ] Все Secrets добавлены в HF Space
- [ ] `FRONTEND_URL` = URL GitHub Pages
- [ ] `NEXT_PUBLIC_API_URL` = URL HF Space
- [ ] Stripe webhook указывает на HF Space
- [ ] Google OAuth redirect URIs настроены
