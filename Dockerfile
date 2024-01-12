FROM node:20-alpine

ENV DATABASE_URL="postgresql://root:123@db:5432/heroes?schema=public"

WORKDIR /api-tree-heroes

COPY package.json ./

RUN npm install

COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json ./

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "migrate-and-start"]

