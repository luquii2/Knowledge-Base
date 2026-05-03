import json
from sentence_transformers import SentenceTransformer, util

print("Загрузка модели для поиска...", flush=True)
#Заменил языковую модель на multilingual, чтобы она могла работать с русским языком
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2') 
print("Модель загружена!", flush=True)

def load_db(filename='vector_db.json'):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Файл {filename} не найден! Сначала запусти parser.py", flush=True)
        return None

def search(query, db, top_k=2):
    """Превращает вопрос в вектор и ищет наиболее похожие куски текста"""
    # 1. Векторизуем вопрос пользователя
    query_vector = model.encode(query)
    
    results = []
    # 2. Проходимся по всем файлам в базе
    for filename, data in db.items():
        chunks = data['chunks']
        vectors = data['vectors']
        
        # util.cos_sim сравнивает вектор вопроса со всеми векторами кусков текста
        similarities = util.cos_sim(query_vector, vectors)[0]
        
        # Собираем все оценки
        for i, score in enumerate(similarities):
            results.append({
                'score': float(score), # Оценка от -1 до 1 (чем ближе к 1, тем точнее)
                'text': chunks[i],
                'filename': filename
            })
    
    # 3. Сортируем от лучших совпадений к худшим
    results = sorted(results, key=lambda x: x['score'], reverse=True)
    
    # Возвращаем только топ-K результатов
    return results[:top_k]

if __name__ == '__main__':
    db = load_db()
    if db:
        print("\n" + "="*50)
        print("ПОИСКОВИК ГОТОВ К РАБОТЕ!")
        print("Введи свой вопрос или напиши 'exit' для выхода.")
        print("="*50 + "\n")
        
        while True:
            user_query = input("Твой вопрос: ")
            
            if user_query.lower() == 'exit':
                print("Пока!")
                break
            if not user_query.strip():
                continue
            
            best_matches = search(user_query, db, top_k=2)
            
            print("\n--- РЕЗУЛЬТАТЫ ПОИСКА ---")
            for i, match in enumerate(best_matches):
                print(f"\n[{i+1}] Оценка совпадения: {match['score']:.3f} | Из файла: {match['filename']}")
                print(f"Текст:\n{match['text']}\n")
            print("-" * 25)