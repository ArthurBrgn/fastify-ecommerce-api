FROM node:22-slim

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm db:generate
RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
