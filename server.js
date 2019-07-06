const express = require('express');
const axios = require('axios');
const schedule = require('node-schedule');
const cors = require('cors');
const app = express();
const keyStoreUrl = 'https://api.keyvalue.xyz/e6bf679e/josh';

app.use(cors());

schedule.scheduleJob('0 0 0 * * *', () => {
    set(false).then((response) => {
        console.log(response);
        res.send(response.data);
    });
});

app.get('/status', (req, res) => {
    axios.get(keyStoreUrl).then((response) => {
        res.send(response.data);
    });
});

app.get('/set/:value', (req, res) => {
    let value = req.params.value;
    set(value).then((response) => {
        res.send(response.data);
    });
});

set = (value) => {
    return axios.post(`${keyStoreUrl}/${value}`);
};

const port = 8080;
app.listen(port, () => {
    console.log(`API started on port ${port}`);
});