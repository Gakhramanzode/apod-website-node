# Базовый образ с node.js
FROM node:latest
# Создание рабочего каталога
WORKDIR /app
# Копирование файлов .js в рабочий каталог
COPY index.js /app/
# Копирование HTML-файла в рабочий каталог
COPY index.html /app/
# Открытие 60937 порта для HTTP-запросов
EXPOSE 60937
# Старт node.js сервера
CMD ["node", "index.js"]