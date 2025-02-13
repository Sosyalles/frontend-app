export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };

    if (this.isDevelopment) {
      const color = this.getColorForLevel(level);
      console.log(
        `%c${entry.timestamp} [${level}] ${message}`,
        `color: ${color}; font-weight: bold`,
        context || ''
      );
    } else {
      // In production, we might want to send logs to a logging service
      // For now, we'll just use console.log without colors
      console.log(`${entry.timestamp} [${level}] ${message}`, context || '');
    }
  }

  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '#6c757d'; // gray
      case LogLevel.INFO:
        return '#0d6efd'; // blue
      case LogLevel.WARN:
        return '#ffc107'; // yellow
      case LogLevel.ERROR:
        return '#dc3545'; // red
      default:
        return '#000000'; // black
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context);
  }

  // Specialized logging methods for auth operations
  logAuthAttempt(email: string, success: boolean, error?: Error) {
    const context = {
      email,
      success,
      error: error?.message
    };

    if (success) {
      this.info('Authentication attempt successful', context);
    } else {
      this.warn('Authentication attempt failed', context);
    }
  }

  logAuthAction(action: string, userId: number, success: boolean, error?: Error) {
    const context = {
      action,
      userId,
      success,
      error: error?.message
    };

    if (success) {
      this.info(`Auth action '${action}' successful`, context);
    } else {
      this.warn(`Auth action '${action}' failed`, context);
    }
  }

  // API request logging
  logAPIRequest(method: string, endpoint: string, statusCode: number, duration: number) {
    const context = {
      method,
      endpoint,
      statusCode,
      duration: `${duration}ms`
    };

    if (statusCode >= 500) {
      this.error('API request failed with server error', context);
    } else if (statusCode >= 400) {
      this.warn('API request failed with client error', context);
    } else {
      this.debug('API request completed', context);
    }
  }

  logAPIError(method: string, endpoint: string, error: Error) {
    const context = {
      method,
      endpoint,
      error: error.message,
      stack: this.isDevelopment ? error.stack : undefined
    };

    this.error('API request error', context);
  }
}

export const logger = new Logger(); 