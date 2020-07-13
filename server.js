const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(
    `Server Started in Port ${process.env.PORT} on ${process.env.NODE_ENV} mode`
      .yellow.bold
  );
});

// Handle Unhandled Rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close Server and Exit
  server.close(() => process.exit(1));
});
