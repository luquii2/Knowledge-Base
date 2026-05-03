import os
import json
from sentence_transformers import SentenceTransformer

# 1. Загружаем модель для векторизации
print("Загрузка модели...")
#Заменил языковую модель на multilingual, чтобы она могла работать с русским языком
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2') 

# Изменили параметры на 1200 и 120
def get_chunks(text, chunk_size=1200, overlap=120):
    """Разбивает текст на блоки по 1200 символов с нахлестом 120"""
    step = chunk_size - overlap
    
    chunks = []
    # Идем по тексту с шагом 1080 (1200 - 120)
    for i in range(0, len(text), step):
        chunk = text[i : i + chunk_size]
        if chunk.strip(): # Если кусок не пустой, сохраняем
            chunks.append(chunk)
            
    return chunks

def build_vector_db():
    docs_dir = './docs'
    output_file = 'vector_db.json'
    
    # Если папки docs нет, скрипт ее создаст
    if not os.path.exists(docs_dir):
        os.makedirs(docs_dir)
        print(f"Я создал папку '{docs_dir}'. Положи туда .md файлы и запусти меня снова!")
        return

    database = {}
    print("Читаю файлы...")
    
    # Проходимся по всем файлам в папке docs
    for filename in os.listdir(docs_dir):
        if filename.endswith('.md'):
            with open(os.path.join(docs_dir, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Бьем текст на куски по 1200 символов
            chunks = get_chunks(content)
            
            # Делаем векторы из текста
            print(f"Обрабатываю файл: {filename} (кусков: {len(chunks)})")
            vectors = model.encode(chunks).tolist()
            
            # Записываем в наш словарь
            database[filename] = {
                "chunks": chunks,
                "vectors": vectors
            }
            
    # Сохраняем словарь в файл JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(database, f, ensure_ascii=False, indent=4)
        
    print("Готово! База векторов создана.")

if __name__ == '__main__':
    build_vector_db()