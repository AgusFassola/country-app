const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/',(req,res) => {
    res.send('Hola mundo');
});

app.get('/api/countries', async (req, res) => {
    try{
        const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
        res.json(response.data);
    }catch(error){
        res.status(500).json({ message: 'Error fetching countries' });
    }
});

app.get('/api/cuntry/:code', async (req, res) => {
    const { code } = req.params;

    try{
        const countryInfo = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${code}`);
        const populationData = await axios.get(`https://countriesnow.space/api/v0.1/countries/population`, {
            params: { country: code }
        });
        const flagData = await axios.get(`https://countriesnow.space/api/v0.1/countries/flag/images`);

        res.json({
            countryInfo: countryInfo.data,
            population: populationData.data,
            flagUrl: flagData.data[code]?.flag
        });
    }catch(error){
        res.status(500).json({ message: 'Error fetching country data' });
    }
});

//start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});