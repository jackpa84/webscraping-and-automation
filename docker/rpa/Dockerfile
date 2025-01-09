FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl \
    && pip install --upgrade pip \
    && pip install poetry \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml poetry.lock /app/

RUN poetry config virtualenvs.create false \
    && poetry install --only main --no-root

COPY . /app

CMD ["poetry", "run", "python", "main.py"]
