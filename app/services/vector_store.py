import os
from pathlib import Path

try:
    from langchain_community.vectorstores import FAISS
    from langchain_openai import OpenAIEmbeddings
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False

_BASE = Path(__file__).parent.parent.parent / "data"
_INDEX_PATH = _BASE / "faiss_index"
_vectors = None


def get_vector_store():
    """Синглтон FAISS. Загружает с диска или создаёт пустой."""
    global _vectors
    if _vectors is not None:
        return _vectors
    if not FAISS_AVAILABLE:
        return None
    emb = OpenAIEmbeddings(api_key=os.getenv("OPENAI_API_KEY"))
    if _INDEX_PATH.exists():
        _vectors = FAISS.load_local(str(_INDEX_PATH), emb, allow_dangerous_deserialization=True)
    else:
        from langchain_core.documents import Document
        _vectors = FAISS.from_documents([Document(page_content="")], emb)
    return _vectors


def save_index(vs):
    """Сохранить индекс на диск (для document_loader)."""
    _INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    vs.save_local(str(_INDEX_PATH))


def search(question: str, k: int = 5) -> list[dict]:
    """Семантический поиск. Возвращает [{content, metadata}, ...]."""
    vs = get_vector_store()
    if vs is None:
        return []
    docs = vs.similarity_search(question, k=k)
    return [{"content": d.page_content, "metadata": d.metadata} for d in docs]
