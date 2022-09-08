FROM node:18.8.0

RUN mkdir -p /app

# Copy source to path
COPY src /app/src
COPY public /app/public
COPY package.json /app/
COPY config.json /app/
COPY config.json.example /app/

WORKDIR /app
RUN npm install

CMD ["sh", "start.sh"]
