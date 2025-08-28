import {port, hostname, enviroment} from '../app.mjs';
import {server} from '../app.mjs';
import {default as DEBUG} from 'debug';
import util from 'util';

const debug = DEBUG('app-support:debug');
const debugError = DEBUG('app-support:error');

/**
 * Handlers for uncaughtException that is not caught by try/catch blocks
 *  and unhandledRejections where promises ended up 
 */
process.on('uncoughtException', function(error){
    console.error(`I have crashed!!! - ${error.stack || error}`);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(`Unhandled Rejection at: ${util.inspect(p)} \n Reason: ${reason}`);
});

/**
 * 
 * @param {*} portNumber 
 * @returns a valid port number unless it is empty
 */
const normalizePort = function(portNumber){
    const port = parseInt(portNumber, 10);
    if(isNaN(port)){
        return portNumber;
    }

    if(port >= 0){
        return port;
    }

    return false;
}

const onError = function(error){
    debugError(error);
    if(error.syscall !== 'listen'){
        throw error;
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    switch(error.code){
        case 'EACCESS':
            console.error(`${bind} requires elevated privileges`);
            break;
        case 'EADDDRINUSE':
            console.error(`${bind} is already in use`);
            break;
        case 'ENOTESSTORE':
            console.error(`Notes data store initialization failure because ${error.error}`);
            process.exit(1);
        default:
            throw error;
    }

}

const onListening = function (){
    const address = server.address();
    const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;

    console.log(`Listening on ${bind} running at ${hostname} in ${enviroment} mode`);
}

const handle404 = function(request, response, next){
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
}

const handle401 = function(request, response, next){
    const error = new Error("Unauthorized User");
    error.status = 401;
    next(error);
}

const basicErrorHandler = function(error, request, response, next){
    //Defer to built-in error handler if headerSent
    //See: http://expressjs.com/en/guide/error-handling.html

    if(response.headerSent){
        return next(error);
    }

    //set locals, only providing error in development
    response.locals.message = error.message;
    response.locals.error = request.app.get('env') === 'development' ? error : {};

    //render the error page

    response.status(error.status || 500);
    response.render('error');
}

export {normalizePort, onError, onListening, handle404, basicErrorHandler};