// config/configuration.ts
export const configConfiguration = () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  mp: {
    appid: process.env.MP_APPID,
    secret: process.env.MP_APPSECRET,
  },
});
