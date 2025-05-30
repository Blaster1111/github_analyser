# syntax=docker/dockerfile:1
FROM python:3.9-slim

# Disable BuildKit to avoid socket connection issues on Render
ENV DOCKER_BUILDKIT=0

# Install basic system dependencies and tools
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright system dependencies and browsers
RUN playwright install-deps && playwright install chromium

# Set working directory
WORKDIR /app

# Copy application files
COPY main.py .

# Expose port
EXPOSE 5000

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]

