// Импортируем модули
const chai = require('chai');
const http = require('http');

// Создаем переменную expect
const expect = chai.expect;

// Определяем группу тестов
describe('Server', function() {
  // Определяем один тест
  it('should start and respond to requests', function(done) {
    // Отправляем GET-запрос на сервер
    http.get('http://172.18.0.2:80', function(response) {
      // Проверяем статус ответа
      expect(response.statusCode).to.equal(200);
      // Завершаем тест
      done();
    });
  });
});
