const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viwesPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viwesPath);
hbs.registerPartials(partialsPath);

// Setup static directory to store
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Noam Korkos'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Noam Korkos'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Hey',
        title: 'Help',
        name: 'Noam Korkos'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address"
        })
    }
    geocode(req.query.address, (error, { latitude, longitude , location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
});


app.get('/help/*',  (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Noam Korkos',
        errorMessage: 'Help aricle nor found'
    })
})


app.get('*',  (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Noam Korkos',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})