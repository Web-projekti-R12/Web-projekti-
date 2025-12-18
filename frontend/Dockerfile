FROM node:20

WORKDIR /usr/src/app

# Riippuvuudet
COPY package*.json ./
RUN npm install -g nodemon && npm install

# kopioi lähdekoodin
COPY . .

# Vite muuttujat
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# build 
RUN npm run build

# Vite oletus portti
EXPOSE 4173

# buildi
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]