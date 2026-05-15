const PREFIX = '[quantum-risk]';

type LogArgs = unknown[];

export const logger = {
  info: (...args: LogArgs) => {
    console.info(PREFIX, ...args);
  },
  warn: (...args: LogArgs) => {
    console.warn(PREFIX, ...args);
  },
  error: (...args: LogArgs) => {
    console.error(PREFIX, ...args);
  },
};;

export default logger;
