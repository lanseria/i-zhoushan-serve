// config/configuration.ts
export const configConfiguration = () => {
  return {
    api: {
      port: parseInt(process.env.API_PORT, 10) || 8080,
    },
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
      user: process.env.DATABASE_USER,
      pass: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
    },
    cache: {
      host: process.env.CACHE_HOST,
      port: process.env.CACHE_PORT,
      ttl: process.env.CACHE_TTL,
    },
    mp: {
      token: process.env.MP_TOKEN,
      appid: process.env.MP_APPID,
      secret: process.env.MP_APPSECRET,
    },
    minio: {
      url: process.env.MINIO_ENDPOINT,
      host: process.env.MINIO_HOST,
      port: parseInt(process.env.MINIO_HOST, 10) || 9000,
      user: process.env.MINIO_ACCESSKEY,
      pass: process.env.MINIO_SECRETKEY,
      bucket: process.env.MINIO_BUCKET,
    },
  };
};
