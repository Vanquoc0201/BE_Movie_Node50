# 1. Base image (Node.js)
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy toàn bộ project vào container
COPY . .

# 6. Build NestJS project (chuyển TS sang JS)
RUN npm run build

# 7. Lệnh chạy ứng dụng (bản production dùng dist/)
CMD ["node", "dist/main"]

# 8. Mở cổng ứng dụng
EXPOSE 3000
