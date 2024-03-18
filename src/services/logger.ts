import { config, createLogger, Logger, transports } from 'winston';

export const logLevel = (): string => {
    if (
        process.env.LOG_LEVEL !== null &&
        process.env.LOG_LEVEL !== undefined &&
        process.env.LOG_LEVEL.toLowerCase() in config.npm.levels
    ) {
        return process.env.LOG_LEVEL.toLowerCase();
    }

    return 'info';
};

export const logger: Logger = createLogger({
    defaultMeta: {},
    exceptionHandlers: [new transports.Console()],
    level: logLevel(),
    levels: config.npm.levels,
    silent: process.env.NODE_ENV === 'test',
    transports: [new transports.Console()]
});
