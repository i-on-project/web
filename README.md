# i-on Web
<p align="center">
    <img src="/project/static-files/images/Logo2_i-on.png" width="500px" alt="i-on Web" />
</p>
<p align="center">
    <a href="https://github.com/i-on-project/web/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/i-on-project/web" alt="License" />
    </a>
    <a href="https://github.com/i-on-project/web/graphs/contributors/">
        <img src="https://img.shields.io/github/contributors/i-on-project/web" alt="Contributors" />
    </a>
    <a href="https://github.com/i-on-project/web/issues/">
        <img src="https://img.shields.io/github/issues/i-on-project/web" alt="Issues" />
    </a>
    <a href="https://github.com/i-on-project/web/pulls/">
        <img src="https://img.shields.io/github/issues-pr/i-on-project/web" alt="Pull requests" />
    </a>
    <a href="https://github.com/i-on-project/web/commits/main">
        <img src="https://img.shields.io/github/last-commit/i-on-project/web" alt="Last commit" />
    </a>
</p>

## Overview

The i-on initiative aims to build an extensible platform in order to support academic activities, in other words, the goal is the restribuiton of the academic information in more computationally convenient formats. The i-on Web project consists of a web application to provide a user interface through web browsers.

## Table of contents
- [Functionalities](#functionalities)
- [Getting started](#getting-started)
- [Docker compose](#docker-compose)
- [Operation Modes](#operation-modes)
    - [Standalone mode](#standalone-mode)
    - [Integrated mode](#integrated-mode)
- [Running i-on Web](#running-i-on-web)
- [i-on Web online](#i-on-web-online)

## Functionalities
i-on Web has the following functionalities available:

- Exposition of the curricular plan for multiple programmes;
- Exposition of multiple programmes general information;
- Authentication;
- Allow the student to select courses and the possibility to cancel that selection;
- Construction of the student's schedule (in accordance with the courses selected);
- Make it possible to view the list of selected courses;
- Notify the student, on the home page, of upcoming events (tests, exams, among others) of the courses he / she attends;
- Construction of the student's calendar with the events of the courses to which he is enrolled;
- Make it possible to download (pdf file) the student's schedule;
- Allow the user to change his/hers username.

i-on Web is continuously being developt, as such, more funcionalities will be / are being added, namely:

- Switch the language (between Portuguese and English) of the web interface.

# Getting started
Next we will see how we can run the i-on Web application according to its operation modes and using docker compose.

## Docker-compose
The docker compose file contains the following enviroment variables:
- __`OPERATION_MODE`__ - Where we can specify the operation mode. By default, its integrated mode which connects to i-on Core;

- __`CORE_URL`__ - Where we can indicate the location of i-on Core. By default is set to `http://172.17.0.1:10023` since i-on Core listens on port `10023` and since both applications are running locally but in isolated containers, in order to make requests from i-on Web to i-on Core we can use the IP `172.17.0.1`;

__Note:__ Usually Docker uses the default `172.17.0.0/16` subnet for container networking, in which `172.17.0.1` is the default gateway. By using this IP we can use the bridge connection to make requests to i-on Core.

- __`CORE_READ_TOKEN`__ - Access token used in order to obtain data from i-on Core. By default, it has the value indicated in the i-on Core documentation `l7kowOOkliu21oXxNpuCyM47u2omkysxb8lv3qEhm5U`;

- __`CORE_CLIENT_ID`__ - The unique id of the client provided by the core system. By default, it has the value indicated in the i-on Core documentation `22dd1551-db23-481b-acde-d286440388a5`;

- __`DB_ELASTIC_URL`__ - Where we can indicate the location of the Elasticsearch database. By default is set to `http://elasticsearch:9200`;

- __`PATH_PREFIX`__ - Where we can indicate a path prefix to the applicattion. By default it has no value.

## Operation Modes
The i-on Web application has two operation modes and you can use either one of them.

### Standalone mode
The standalone mode allows us to run the i-on Web application using mock data stored in .json files, which we can view [here](https://github.com/i-on-project/web/tree/main/project/mock-data/standalone).

When building the docker image we can specify the development operation mode by setting the build-time variable `OPERATION_MODE` with the value `standalone` by using the following command on the __root directory__:
```
docker-compose -f .docker/docker-compose.yml build --build-arg OPERATION_MODE="standalone"
```

### Integrated mode
This mode allows us to run the i-on Web application using the data provided by i-on Core, as such, both i-on Web and i-on Core need to be running locally. In order to download and run i-on Core please head to the [i-on Core GitHub repository](https://github.com/i-on-project/core).

The environment variables present in the docker compose file should be enough for us to establish a connection to i-on Core, as such, we only need to execute the following command on the __root directory__:
```
docker-compose -f .docker/docker-compose.yml build
```
In similarity to the command previously shown, we can assign values to the enviroment variables, as shown in the following example:
```
docker-compose -f .docker/docker-compose.yml build --build-arg PATH_PREFIX="/i-on-web" --build-arg CORE_READ_TOKEN="l7kowOOkliu21oXxNpuCyM47u2omkysxb8lv3qEhm5U"
```

## Running i-on Web
After executing the build command, in order to run i-on Web locally we can execute the following command on the __root directory__:
```
docker-compose -f .docker/docker-compose.yml -p i-on-web up web_app
```
After running the previous command i-on Web should be available on port `8080`.

## i-on Web online
The i-on Web application is also available online since we deploy it to heroku. You can check it out [here](https://i-on-web.herokuapp.com). Please notice that since its a demo version the only programmes that contain classes and class sections to subscribe to are the programmes 'LEIRT' and 'LEIC'.
