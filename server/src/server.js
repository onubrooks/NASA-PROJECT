const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;

const MONOGDB_URI =
  `mongodb+srv://${dbUser}:${dbPass}@cluster0.lsm64co.mongodb.net/nasa?retryWrites=true&w=majority`;

const server = http.createServer(app);

mongoose.connection.once('open' , () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer() {
    await mongoose.connect(MONOGDB_URI);
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
}

startServer();