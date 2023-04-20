const assert = require('assert'); // Подключаем модуль assert для проверки утверждений
const request = require('supertest'); // Подключаем модуль supertest для тестирования HTTP-запросов
const server = require('../index'); // Подключаем веб-сайта

// Описываем набор тестов с помощью функции describe
describe('GET /', function() {
  // Описываем конкретный тест с помощью функции it
  it('responds with status code 200', function(done) {
    // Отправляем GET-запрос на главную страницу веб-сайта
    request(server)
      .get('/')
      // Проверяем, что сервер отвечает с кодом состояния 200
      .expect(200, done);
  });
});

// Функция для автоматического закрытия сервера после завершения тестов
after(function(done) {
  server.close(done);
});