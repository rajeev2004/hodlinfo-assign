const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();
const app = express();
const port = 3000;
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false 
      }
});
app.use(express.static('public'));
async function fetchData() {
    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const top10 = Object.values(response.data).slice(0, 10);

        for (const crypto of top10) {
            const { name, last, buy, sell, volume, base_unit } = crypto;
            await pool.query(
                'INSERT INTO crypto_data (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (name) DO NOTHING',
                [name, last, buy, sell, volume, base_unit]
            );
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchData();
app.get('/api/crypto', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM crypto_data');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/telegram',(req,res)=>{
    res.render("telegram.ejs");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
