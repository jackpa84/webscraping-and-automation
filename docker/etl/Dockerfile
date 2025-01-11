FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    unzip \
    wget \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xvfb \
    lsb-release \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Add the Google Chrome repository and install Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install Poetry
RUN pip install --upgrade pip \
    && pip install poetry

# Copy dependency files
COPY ./backend/etl/pyproject.toml /app/
COPY ./backend/etl/poetry.lock /app/

# Install Python dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-root

# Copy the rest of the application code
COPY ./backend/etl/ /app

# Set environment variable for Chrome headless
ENV GOOGLE_CHROME_BIN=/usr/bin/google-chrome

# Define the default command to run the application
CMD ["poetry", "run", "python", "main.py"]
