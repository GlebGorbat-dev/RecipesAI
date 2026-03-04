from pydantic import BaseModel, Field
from datetime import datetime


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str


class RecipeAskRequest(BaseModel):
    """Запрос к RAG AI по рецептам (только по документам)."""
    question: str = Field(..., min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default_factory=list, max_length=20)


class RecipeSource(BaseModel):
    """Источник в ответе AI (документ/рецепт)."""
    title: str
    content_preview: str | None = None


class RecipeAskResponse(BaseModel):
    """Ответ RAG AI с рецептом."""
    answer: str
    sources: list[RecipeSource] = Field(default_factory=list)


class RecipeResponse(BaseModel):
    """Рецепт для отображения на сайте (карточка, детальная страница)."""
    id: int
    title: str
    slug: str | None
    description: str | None
    content_preview: str | None
    category: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
