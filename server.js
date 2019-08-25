// sets up dependencies
const express = require('express');
const axios = require('axios');
const schedule = require('node-schedule');
const cors = require('cors');
const app = express();
const keyStoreUrl = 'https://api.keyvalue.xyz/b389543c/w-a-l-k';

// cors allows access from different origins - without it, API wouldn't run due to Same-origin policy
app.use(cors());

// register a static directory. allows retrieval of index.html which would otherwise result in a 404.
app.use(express.static('public'))

// schedules reset to take place automatically every night at midnight
schedule.scheduleJob('0 0 0 * * *', () => {
    set(false).then((response) => {
        console.log(response);
        res.send(response.data);
    });
});

app.get('/', (req, res) => {
    res.redirect('https://w-a-l-k.azurewebsites.net/index.html');
});

// gets current status
app.get('/status', (req, res) => {
    axios.get(keyStoreUrl).then((response) => {
        res.send(response.data);
    });
});

// get request, changes status based on :value path
app.get('/set/:value', (req, res) => {
    let value = req.params.value;
    set(value).then((response) => {
        res.send(response.data);
    });
    res.redirect('/');
});

// set() function, changes status by going to path for true/false value
set = (value) => {
    return axios.post(`${keyStoreUrl}/${value}`);
};

// sets up port to use. uses server's selected port or 3000 locally
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API started on port ${port}`);
});
