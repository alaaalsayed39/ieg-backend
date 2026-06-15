'use strict';

require('dotenv').config();

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.warn(`[ENV] Missing variables: ${missing.join(', ')}`);
}

const allowedOrigins = [
  'http://localhost:5173',
  'https://ieg-frontend.vercel.app'
];

if (process.env.CLIENT_URL) {
  const urls = process.env.CLIENT_URL.split(',').map(url => url.trim());
  urls.forEach(url => {
    if (url && !allowedOrigins.includes(url)) {
      allowedOrigins.push(url);
    }
  });
}

if (process.env.ALLOWED_ORIGINS) {
  const urls = process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim());
  urls.forEach(url => {
    if (url && !allowedOrigins.includes(url)) {
      allowedOrigins.push(url);
    }
  });
}

const checkOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  const allowed = allowedOrigins.includes(origin) ||
    /^https:\/\/ieg-frontend(-[a-z0-9-]+)?\.vercel\.app$/.test(origin) ||
    /^https:\/\/ieg-frontend-[a-z0-9-]+-alaaalsayed159-7016s-projects\.vercel\.app$/.test(origin);
  if (allowed) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

module.exports = {
  NODE_ENV:   process.env.NODE_ENV || 'development',
  PORT:       parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI:  require('./mongoUri').getMongoUri(),
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'ieg_platform',
  CORS: {
    ALLOWED_ORIGINS: allowedOrigins,
    checkOrigin
  },
  JWT: {
    ACCESS_SECRET:  process.env.JWT_ACCESS_SECRET  || 'ieg_dev_access_secret_32chars_min',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'ieg_dev_refresh_secret_32chars_min',
    ACCESS_EXPIRES:  process.env.JWT_ACCESS_EXPIRES  || '15m',
    REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY:    process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  SMTP: {
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
    USER: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASS,
    FROM: process.env.SMTP_FROM || '"IEG Platform" <noreply@iegplatform.com>',
  },
  PLATFORM_FEE_PERCENT: parseFloat(process.env.PLATFORM_FEE_PERCENT) || 3,
};
