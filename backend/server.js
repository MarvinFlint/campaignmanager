import pg from 'pg';
import express from 'express';
import cors from 'cors';

const app = express()
const port = 3000

app.use(express.json());
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

app.get('/campaigns/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM campaign WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json(result.rows[0]);
        console.log(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching campaign');
    }
});

app.post('/campaigns', async (req, res) => {
    const { name, description } = req.body;
    console.log(name, description);
    try {
        const result = await pool.query('INSERT INTO campaign (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating campaign');
    }
});


app.listen(port, () => {
    console.log(`Module Manager backend listening on port ${port}`)
})