require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const actionRoute = require('./src/routes/actionRoute');

const KafkaConsumerService = require('./src/services/kafkaConsumerService');
const kafkaConsumerService = new KafkaConsumerService();

kafkaConsumerService.connect();

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Action Backend is Running');
});

app.use(actionRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
