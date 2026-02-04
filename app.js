const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware');
const { successResponse } = require('./utils/response');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Tilal API is running...');
});

app.get('/test', (req, res) => {
    successResponse(res, { name: 'Tilal' }, 'API working');
});

app.use(errorHandler);

module.exports = app;
