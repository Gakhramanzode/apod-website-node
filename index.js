// Импорт модуль fs
const fs = require("fs");

// Импорт модуль http
const http = require("http");
// Определение порта для прослушивания
const port = 60937;
// Создание объект сервера
const server = http.createServer((req, res) => {
  // Проверка, относится ли запрос к корневому пути
  if (req.url === "/") {
    // Установка заголовка ответа таким, чтобы он указывал содержимое HTML
    res.writeHead(200, {"Content-Type": "text/html"});
    // Чтение HTML-файла и отправка его в качестве ответа
    fs.readFile("index.html", (err, data) => {
      if (err) {
        // Обработка любых ошибок
        console.error(err);
        res.end("Sorry, something went wrong. Please try again later.");
      } else {
        // Отправка HTML-файла в качестве ответа
        res.end(data);
      }
    });
  } else {
    // Обработка любых других запросов
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.end("Not found");
  }
});
// Запуск сервера и прослушивание порта
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});