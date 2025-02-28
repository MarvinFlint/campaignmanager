import pg from 'pg';
import express from 'express';
import cors from 'cors';

const app = express()
const port = 3000

app.use(cors());

const pool = new pg.Pool({
    user: 'module_manager',
    host: 'localhost',
    database: 'modules',
    password: 'neverwinternights',
    port: 5432,
});

app.get('/campaigns', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM campaign');
        res.json(result.rows);
        console.log(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching campaigns');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})