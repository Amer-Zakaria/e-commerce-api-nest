export default () => ({
  name: 'Users - production',
  db: {
    uri: process.env.MONGODB_USERS_URI,
  },
  clientOptions: {
    host: process.env.CLIENT_USER_HOST,
    port: process.env.CLIENT_USER_PORT,
    httpPort: process.env.CLIENT_USER_HTTP_PORT,
  },
});
