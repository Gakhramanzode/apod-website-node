## Вступление

Этот pet-проект послужил мне тренировкой для создания CI (от фиксации в репозитории до загрузки в docker registry) для node.js-приложения. Может кому-нибудь будет это интересно и полезно, поэтому я решил поделиться своей работой.

Если вы начинающий DevOps-инженер и вам хочется попрактиковаться в написании Continuous Integration (CI), этот репозиторий может вам в этом помочь. Мне кажется здесь достаточно для хорошей практики: node.js, webhook, jenkins, docker. Само приложение представляет из себя простой веб-сайт, который обращается к API NASA и отображает завораживающию картинку космоса с интересным описанием. Вот такой простой веб-сайт. Но ведь большего и не надо. Основной акцент сделан на тренировке написания `Jenkinsfile`.

<p align="center">
  <img src="img\apod-website-node architecture.png" alt="apod-website-node architecture">
  <figcaption>Небольшая схема для понимания работы веб-сайта</figcaption>
</p>

## Поднятие jenkins

Чтобы создать и настроить пайплайн, я использовал jenkins, который был запущен в docker-контейнере. Для поднятия jenkins пользовался официальной документацией. Вот [ссылка](https://www.jenkins.io/doc/book/installing/docker/). 

Теперь по порядку. Сначала поднял виртуальную машину CentOS 7 в Яндекс Облаке. Подключился к ВМ по SSH. Обновил пакеты. Установил docker ([ссылка](https://github.com/Gakhramanzode/Airflow/blob/master/src-centos.sh) на мой другой репозиторий, где со строки 17 по 39 показаны примеры команд для его установки).

Выполнил эту команду на ВМ, чтобы jenkins мог иметь доступ к docker-демону и собирать наше приложение.
```
sudo chmod 666 /var/run/docker.sock
```
Если не выполнить команду, скорее всего в jenkins при сборке будет примерно такая ошибка.
```
+ docker build -t apod-website-node:1.0.53 .
ERROR: permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/_ping": dial unix /var/run/docker.sock: connect: permission denied
```
*Уверен есть и другой способ связки, если мне удасться его найти, обязательно поправлю инструкцию. Этот способ мне не особо нравится, потому что он снижает безопасность системы linux.*

Далее создал сетевой мост
```
docker network create jenkins
```

Запустил контейнер `docker:dind`
```
docker run --name jenkins-docker --rm --detach \
  --privileged --network jenkins --network-alias docker \
  --env DOCKER_TLS_CERTDIR=/certs \
  --volume jenkins-docker-certs:/certs/client \
  --volume jenkins-data:/var/jenkins_home \
  --publish 2376:2376 \
  docker:dind --storage-driver overlay2
```

Создал `Dockerfile` со следующей инструкцией
```
FROM jenkins/jenkins:2.387.2
USER root
RUN apt-get update && apt-get install -y lsb-release
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
USER jenkins
RUN jenkins-plugin-cli --plugins "blueocean docker-workflow"
```

Собрал образ `myjenkins-blueocean:2.387.2-1`
```
docker build -t myjenkins-blueocean:2.387.2-1 .
```

Запустил его

```
docker run --name jenkins-blueocean --restart=on-failure --detach \
  --network jenkins \
  --publish 8080:8080 --publish 50000:50000 \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume jenkins-data:/var/jenkins_home \
  myjenkins-blueocean:2.387.2-1
```

И последнее, ввел команду
```
sudo docker exec jenkins-blueocean cat /var/jenkins_home/secrets/initialAdminPassword
```
То, что выдало в терминале (это пароль для разблокировки jenkins при первом входе) скопировал, в браузере открыл страницу jenkins по URL-адресу `http://<IP адрес ВМ>:8080`, где вставил тот самый пароль для разблокировки. Далее простая настройка уже самого jenkins: какие плагины устанавливать и создание пользователя. Все, jenkins готов :+1:.

## Клонирование репозитория и поднятие веб-сайта

Делам форк моего репозитория. Далее уже свой репозиторий клонируете себе на локальную машину. 

:shipit: Можете с помощью docker также собрать образ приложения `apod-website-node`, т.к. в репозитории есть `Dockerfile`. 

Стандартная команда для сборки
```
docker build -t apod-website-node:1.0.0 .
```
Также стандартная команда для запуска контейнера
```
docker run -d -p 60937:60937 apod-website-node:1.0.0
```

Переходите на URL-адрес `http://<IP адрес ВМ>:60937` и видите примерно следующее:
<p align="center">
  <img src="img\apod-website-node example.jpeg" alt="apod-website-node example">
  <figcaption>Пример отображения веб-страницы :star_struck:</figcaption>
</p>

Также вы можете попробовать собрать и запустить приложение с помощью node.js на своей локальной машине. Для этого у вас соответсвенно должен быть установлен node.js (у меня была версия `v14.21.3`) и npm (у меня была версия `6.14.18`). 

Команды также стандартные.

Запуск веб-сайта
```
npm start
```
Для интереса еще написал небольшой тест, его запустить можно соответвенно командой
```
npm test
```

## Настройка пайплайна в jenkins

На главной странице jenkins выбираем **Создать Item**, придумаваем и вводим имя для пайплайна, далее выбираем чуть ниже **Pipeline**. 

:white_check_mark: В самом пайплайне отмечаем чек напротив **GitHub project**, вставляем URL-адрес своего репозитория в GitHub. 

:white_check_mark: Далее чек напротив **GitHub hook trigger for GITScm polling** в разделе **Build Triggers**, чтобы пайп запускался автоматически при изменении в репозитории GitHub, а не только при ручном запуске. Чтобы все работало, вам еще необходимо будет перейти в настройки своего репозитория GitHub, выбрать раздел **Webhooks**, нажать **Add webhook**. Ввести URL-адрес `http://<IP адрес ВМ>:8080/github-webhook/`. Выберите тип содержимого JSON. И все, должно успешно пропинговаться и работать.

:white_check_mark: В разделе **Pipeline** выбрать **Pipeline script from SCM** (т.к. в корневом каталоге существует `Jenkinsfile`), где необходимо будет вновь указать URL-адрес своего репозитория GitHub. Сохраняете.

:white_check_mark: Перейти в настройки jenkins. В разделе **Credentials** нажать на ссылку **(global)**, затем на кнопку справа вверху **Add Credentials**. В поле **Kind** выберите **Username with password**. Указываете свой логин и пароль от Docker Hub в поле **Username** и **Password** соответственно. Вводите идентификатор учетных данных в поле **ID**. Этот идентификатор будет использоваться в вашем `Jenkinsfile` (этап **Docker push** в пайплайне) для ссылки на учетные данные. В моем случае это *docker-hub-credentials*. Сохраняете.

:white_check_mark: И последнее, т.к. это node.js приложение, необходимо установить соответвующий плагин в jenkins. Вот [ссылка](https://plugins.jenkins.io/nodejs/) на документацию плагина. Чтобы его установить достаточно перейти в раздел плагинов jenkins, ввести в поиске **nodejs**, установить и настроить в разделе **Конфигурация глобальных инструментов**. Там необходимо будет просто задать имя (в моем случае это просто *Node.js*).

Попробуйте сделать фиксацию своего репозитория, после чего автоматически должен запуститься ваш пайплайн.
<p align="center">
  <img src="img\apod-website-node ci.png" alt="apod-website-node ci">
  <figcaption>Схема CI</figcaption>
</p>
На этом все. Надеюсь эта интрукция  будет для Вас полезной. Желаю удачи! :shipit: