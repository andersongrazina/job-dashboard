FROM node:18-alpine

WORKDIR /app

# Copy everything first
COPY . .

# Install production dependencies
RUN npm install --omit=dev

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
