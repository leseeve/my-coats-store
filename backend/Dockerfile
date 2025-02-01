# backend/Dockerfile

# Базовый образ Python
FROM python:3.10-slim

# Установка рабочей директории
WORKDIR /app/coatstore

# Копирование зависимостей
COPY coatstore/requirements.txt .

# Установка зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копирование остального кода
COPY coatstore/ .

# Команда для запуска сервера
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]