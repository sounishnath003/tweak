export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 1337,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_TOKEN: process.env.JWT_TOKEN,
});
