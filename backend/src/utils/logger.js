'use strict';

const winston       = require('winston');
const { getTraceId } = require('./context');
const path          = require('path');

const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Custom logging levels matching Syslog specification
const levels = {
  error:   0,
  warn:    1,
  info:    2,
  http:    3,
  verbose: 4,
  debug:   5,
};

// Colors mapping for development console output
const colors = {
  error:   'red',
  warn:    'yellow',
  info:    'green',
  http:    'magenta',
  verbose: 'cyan',
  debug:   'blue',
};
winston.addColors(colors);

// ── Custom Formats ──────────────────────────────────────────────────────────

/**
 * Injects request traceId dynamically from AsyncLocalStorage context into log metadata
 */
const injectTraceId = winston.format((info) => {
  const traceId = getTraceId();
  if (traceId) {
    info.traceId = traceId;
  }
  return info;
});

// Production structured JSON format
const productionFormat = winston.format.combine(
  injectTraceId(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Local development colored output format
const developmentFormat = winston.format.combine(
  injectTraceId(),
  winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, traceId, stack, ...meta }) => {
    const traceStr = traceId ? ` [traceId: ${traceId}]` : '';
    const metaStr  = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const stackStr = stack ? `\n${stack}` : '';
    return `${timestamp} ${level}:${traceStr} ${message}${metaStr}${stackStr}`;
  })
);

// ── Logger Configurations ───────────────────────────────────────────────────

const transports = [
  // Always output to stderr/stdout
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  }),
];

// Write to files in non-production environments for local troubleshooting
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level:    'error',
      format:   productionFormat,
      maxsize:  5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      format:   productionFormat,
      maxsize:  10485760, // 10MB
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  level: LOG_LEVEL,
  levels,
  format: productionFormat, // Default fallback
  transports,
  exitOnError: false,
});

const morganStream = {
  write: (message) => logger.http(message.trim()),
};

module.exports = logger;
module.exports.morganStream = morganStream;
