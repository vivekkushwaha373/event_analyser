# Backend Dockerfile for Django + Uvicorn
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && pip install uvicorn

COPY . .

EXPOSE 8000

CMD ["uvicorn", "eventsearch.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"] 