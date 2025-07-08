# 1. Use Node.js base image
FROM node:20

# 2. Set working directory
WORKDIR /app

# 3. Copy everything
COPY . .

# 4. Install all dependencies (incl. ts-node and Prisma)
RUN npm install

# 5. Build your TypeScript files
RUN npm run build --omit=dev

# 6. Expose the correct port (Cloud Run uses 8080)
ENV PORT=8080

# 7. Start the server — use compiled code
CMD ["sh", "-c", "npx prisma generate && node dist/index.js"]