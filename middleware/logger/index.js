import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';

import config from '../../config';


const { combine, timestamp, label, simple, printf, colorize } = format;

if (!fs.existsSync ('logs')) {
  // create directory if it doesn't exist
  fs.mkdirSync ('logs');
}

const logger = createLogger ({
  level: 'info',
  format: combine(
    label({label: config.app_name}),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    simple(),
    printf(info => {
      const padding = info.padding && info.padding[info.level] || '';
      return `${info.timestamp} [${info.label}] ${info.level}:${padding} ${info.message}`;
    }),
    colorize(),
  ),
  transports: [
    new DailyRotateFile({ filename: 'logs/error.log', level: 'error' }),
    new DailyRotateFile({ filename: 'logs/info.log', level: 'info' }),
  ],
  // exceptionHandlers: [
  //   new transports.File({ filename: 'logs/exceptions.log' })
  // ],
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console ({
    format: simple()
  }));
}

export default logger;