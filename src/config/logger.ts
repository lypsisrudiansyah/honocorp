import pino from 'pino';
import fs from 'node:fs';
import path from 'node:path';

const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const fileStream = pino.destination({
  dest: path.join(logDir, 'app.log'),
  sync: false,
  mkdir: true,
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label: string) => ({ level: label }),
    },
  },
  pino.multistream([
    { stream: process.stdout },
    { stream: fileStream },
  ])
);
