# Use a Node.js base image with Playwright
FROM mcr.microsoft.com/playwright:v1.52.0-noble

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the entire project
COPY . .

# Default command to run tests

# CMD ["sh", "-c", "xvfb-run --auto-servernum -- npx playwright test"]
CMD ["sh", "-c", "rm -rf /app/reports/* && xvfb-run --auto-servernum -- npx playwright test"]
