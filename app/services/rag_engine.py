from app.services.vector_store import search
from app.core.config import settings
from app.schemas.recipe import RecipeAskResponse, RecipeSource

SYSTEM = """You are a recipe assistant. Answer based on the provided context from cookbooks.
If there is no relevant recipe in the context, say so. Do not invent recipes.

Important rules:
- Reply in the same language the user writes in. If the user writes in Russian, reply in Russian. If in English, reply in English.
- You have access to conversation history. When the user refers to "this", "it", or your previous answer, use the conversation history to understand what they mean — NOT the raw context.
- When asked to translate, translate YOUR previous answer, not the source context."""

MAX_HISTORY_MESSAGES = 10


async def ask(question: str, history: list | None = None) -> RecipeAskResponse:
    docs = search(question, k=5)
    context = "\n\n---\n\n".join(d["content"] for d in docs if d["content"].strip())
    if not context.strip():
        return RecipeAskResponse(answer="В базе пока нет рецептов. Добавьте документы через document_loader.", sources=[])

    messages = [{"role": "system", "content": SYSTEM}]

    if history:
        for msg in history[-MAX_HISTORY_MESSAGES:]:
            role = msg.role if hasattr(msg, "role") else msg.get("role")
            content = msg.content if hasattr(msg, "content") else msg.get("content")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

    context_msg = f"[Recipe database context for reference — do NOT treat this as the user's message]\n{context}"
    messages.append({"role": "system", "content": context_msg})
    messages.append({"role": "user", "content": question})

    raw_msg = await settings.LLM.ainvoke(messages)
    raw = raw_msg.content if hasattr(raw_msg, "content") else str(raw_msg)
    if isinstance(raw, list):
        answer = "".join(b.get("text", "") if isinstance(b, dict) else str(b) for b in raw)
    else:
        answer = str(raw)

    sources = [RecipeSource(title=d.get("metadata", {}).get("title", "Рецепт"), content_preview=d["content"][:200]) for d in docs if d["content"].strip()]
    return RecipeAskResponse(answer=answer, sources=sources)
