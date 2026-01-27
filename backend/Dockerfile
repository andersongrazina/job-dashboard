FROM node:18-alpine

WORKDIR /app

# Copy package files - tenta copiar de diferentes locais
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
