"""Скрипт загрузки рецептов (txt) в FAISS. Запуск: python -m app.utils.document_loader [data/recipes]"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

def load_docs_from_dir(path: Path) -> list:
    from langchain_core.documents import Document
    docs = []
    for f in path.glob("**/*.txt"):
        text = f.read_text(encoding="utf-8", errors="ignore")
        if text.strip():
            docs.append(Document(page_content=text, metadata={"source": str(f), "title": f.stem}))
    return docs

def main():
    base = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent.parent / "data" / "recipes"
    if not base.exists():
        print(f"Папка не найдена: {base}")
        return
    docs = load_docs_from_dir(base)
    if not docs:
        print("Нет .txt файлов с контентом.")
        return
    from langchain_openai import OpenAIEmbeddings
    from langchain_community.vectorstores import FAISS
    import os
    emb = OpenAIEmbeddings(api_key=os.getenv("OPENAI_API_KEY"))
    vs = FAISS.from_documents(docs, emb)
    out = base.parent / "faiss_index"
    out.mkdir(parents=True, exist_ok=True)
    vs.save_local(str(out))
    print(f"Загружено {len(docs)} документов, индекс: {out}")

if __name__ == "__main__":
    main()
