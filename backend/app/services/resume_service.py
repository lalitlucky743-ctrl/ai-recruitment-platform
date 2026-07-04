from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
import pinecone
import os
from typing import Dict
import hashlib
import redis
from app.config import settings

class ResumeService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        self.redis_client = redis.Redis.from_url(settings.REDIS_URL)
        self._initialize_pinecone()
    
    def _initialize_pinecone(self):
        pinecone.init(
            api_key=settings.PINECONE_API_KEY,
            environment=settings.PINECONE_ENVIRONMENT
        )
        self.index = pinecone.Index(settings.PINECONE_INDEX_NAME)
    
    async def process_resume(self, file):
        try:
            content = await file.read()
            file_hash = hashlib.md5(content).hexdigest()
            
            # Check cache
            cached_result = self.redis_client.get(f"resume:{file_hash}")
            if cached_result:
                return eval(cached_result)
            
            # Save temporarily
            temp_path = f"/tmp/{file.filename}"
            with open(temp_path, "wb") as f:
                f.write(content)
            
            # Load and split
            loader = PyPDFLoader(temp_path)
            documents = loader.load()
            texts = self.text_splitter.split_documents(documents)
            
            # Store in Pinecone
            vectors = self.embeddings.embed_documents([t.page_content for t in texts])
            ids = [f"{file_hash}_{i}" for i in range(len(texts))]
            self.index.upsert(vectors=zip(ids, vectors))
            
            result = {"status": "success", "file_name": file.filename, "chunks": len(texts), "hash": file_hash}
            self.redis_client.setex(f"resume:{file_hash}", 3600, str(result))
            os.remove(temp_path)
            
            return result
        except Exception as e:
            raise Exception(f"Failed to process resume: {str(e)}")