const PREFIX = '[quantum-risk]';

export const logger = {
  info: (...args: any[]) => {
    // enable more sophisticated sinks (Sentry, remote logger) in production
    // keep console calls minimal and consistent
    // eslint-disable-next-line no-console
    console.info(PREFIX, ...args);
  },
  warn: (...args: any[]) => {
    // eslint-disable-next-line no-console
    console.warn(PREFIX, ...args);
  },
  error: (...args: any[]) => {
    // eslint-disable-next-line no-console
    console.error(PREFIX, ...args);
  },
};

export default logger;
