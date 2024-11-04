export default () => ({
  name: 'Fake Store Market - production',
  port: process.env.PORT,
  db: {
    uri: process.env.MONGODB_E_COMMERCE_CORE_URI,
  },
  clients: {
    users: {
      host: process.env.CLIENT_USER_HOST,
      port: process.env.CLIENT_USER_PORT,
    },
  },
});
