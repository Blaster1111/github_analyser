# Use Python base image
FROM python:3.9-slim

# Install required dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
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
    libu2f-udev \
    apt-transport-https \
    && rm -rf /var/lib/apt/lists/*

# Get latest Chrome version dynamically
RUN LATEST_CHROME=$(curl -sL https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone.json | grep -oP '(?<="stable": ")[^"]*') \
    && wget -q "https://storage.googleapis.com/chrome-for-testing-public/${LATEST_CHROME}/linux64/chrome-linux64.zip" \
    && unzip chrome-linux64.zip -d /opt/ \
    && mv /opt/chrome-linux64 /opt/google-chrome \
    && ln -s /opt/google-chrome/chrome /usr/local/bin/google-chrome \
    && rm chrome-linux64.zip

# Get latest ChromeDriver version dynamically
RUN LATEST_DRIVER=$(curl -sL https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone.json | grep -oP '(?<="stable": ")[^"]*') \
    && wget -q "https://storage.googleapis.com/chrome-for-testing-public/${LATEST_DRIVER}/linux64/chromedriver-linux64.zip" \
    && unzip chromedriver-linux64.zip -d /tmp/ \
    && mv /tmp/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver \
    && chmod +x /usr/local/bin/chromedriver \
    && rm -rf chromedriver-linux64.zip /tmp/chromedriver-linux64

# Create and set the working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application files
COPY . .

# Expose the required port
EXPOSE 8000

# Ensure ChromeDriver is detected properly
ENV PATH="/usr/local/bin:${PATH}"
ENV USE_CHROMEDRIVER_ON_PATH=true

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
