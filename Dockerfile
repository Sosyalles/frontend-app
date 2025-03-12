# Build aşaması
FROM node:20-alpine AS build

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm ci

# Proje dosyalarını kopyala
COPY . .

# .env.production yoksa hata verme
RUN touch .env.production

# TypeScript hatalarını görmezden gelerek sadece Vite build'ini çalıştır
RUN npm run build:prod

# Nginx aşaması
FROM nginx:stable-alpine

# Nginx yapılandırmasını kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build çıktısını Nginx'in sunacağı dizine kopyala
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx'in varsayılan ayarlarını ve dosyalarını korumak için
RUN mkdir -p /usr/share/nginx/html/assets

# Nginx 80 portunda çalışacak
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"] 