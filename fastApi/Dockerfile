# Use Python base image
FROM python:3.9-slim

# Install Chrome dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    apt-transport-https \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome directly from the Chrome for Testing Archive
RUN wget -q https://storage.googleapis.com/chrome-for-testing-public/114.0.5735.90/linux64/chrome-linux64.zip \
    && unzip chrome-linux64.zip -d /opt/ \
    && ln -s /opt/chrome-linux64/chrome /usr/bin/google-chrome \
    && rm chrome-linux64.zip

# Download and set up ChromeDriver version 114
RUN wget -q https://storage.googleapis.com/chrome-for-testing-public/114.0.5735.90/linux64/chromedriver-linux64.zip \
    && unzip chromedriver-linux64.zip -d /tmp/ \
    && mv /tmp/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver \
    && rm -rf chromedriver-linux64.zip /tmp/chromedriver-linux64 \
    && chmod +x /usr/local/bin/chromedriver

# Create app directory
WORKDIR /app

# Copy and install requirements first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app files
COPY . .

# Expose port
EXPOSE 8000

# Override the webdriver-manager to use our local ChromeDriver
ENV PATH="/usr/local/bin:${PATH}"
ENV USE_CHROMEDRIVER_ON_PATH=true

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]