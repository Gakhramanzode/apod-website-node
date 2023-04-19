# Базовый образ с node.js
FROM node:latest
# Создание рабочего каталога
WORKDIR /app
# Копирование файлов .js в рабочий каталог
COPY index.js /app/
# Копирование HTML-файла в рабочий каталог
COPY index.html /app/
# Открытие 80 порта для HTTP-запросов
EXPOSE 80
# Старт node.js сервера
CMD ["node", "index.js"]