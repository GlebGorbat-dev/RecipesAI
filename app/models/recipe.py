from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(512), nullable=False, index=True)
    slug = Column(String(512), unique=True, index=True, nullable=True)
    description = Column(Text, nullable=True)
    content_preview = Column(Text, nullable=True)
    category = Column(String(128), nullable=True, index=True)
    source_document = Column(String(512), nullable=True)

    vector_doc_id = Column(String(256), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
