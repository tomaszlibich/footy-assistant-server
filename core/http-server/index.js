const http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    app = express(),
    middlewares = require('../middlewares'),
    logger = require('../logger'),
    api = require('../api'),
    CONFIG = require('../config'),
    FILE_ID = 'http-server';

module.exports = new class HttpServer {
    boot() {
        logger.log(FILE_ID, `Booting ${CONFIG.APP.NAME}...`);

        const server = http.createServer(app),
            port = CONFIG.APP.ADDRESS.HTTP_PORT;

        app.use(middlewares.cors);
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));

        app.all('/api/:resource', api.handle);
        app.all('/api/:resource/:id', api.handle);

        app.use(middlewares.handlerFor404);

        server.listen(port, () => {
            logger.log(FILE_ID, `${CONFIG.APP.NAME} running http server on port ${port}`);
        });
    }
}

