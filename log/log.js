const {createLogger, format, transports, addColors} = require('winston');
const {combine, printf, colorize} = format;
const moment = require('moment');
const FILE_DIR = 'log';
const FILE_NAME = 'LogAPI.log';
const _10_MB = 1024 * 1024 * 10;

const myCustomLevels = {
    levels: {error: 0, warning: 1, info: 2, debug: 3},
    colors: {error: 'red', warning: 'yellow', info: 'green', debug: 'white'}
};

addColors(myCustomLevels.colors);

const myConsoleFormat = printf(info => {
    return `${moment().format('YYYY-MM-DD HH:mm:ss').trim()} - [${info.level}] - ${info.message}`;
});
    
const myFileFormat = printf(info => {
    return `${moment().format('YYYY-MM-DD HH:mm:ss').trim()} - [${info.level.toUpperCase()}] - ${info.message}`;
});

const log = createLogger({
        transports:[
            new (transports.Console)({
                levels: myCustomLevels.levels,
                format: combine(colorize(), myConsoleFormat),
                level: 'debug'
            }),
            new (transports.File)({
                levels: myCustomLevels.levels,
                filename: `${FILE_DIR}/${FILE_NAME}`,
                format: combine(myFileFormat),
                json: true,
                maxsize: _10_MB,
                level: 'info'
            })
        ]
    
    });

module.exports = log;