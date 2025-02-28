import { Pool } from "pg";
const express = require('express')
const app = express()
const port = 3000

app.get('/characters', async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM campaigns');
    res.json(rows);
  });

const pool = new Pool({
    user: 'module_manager',
    host: 'localhost',
    database: 'modules',
    password: 'neverwinternights',
    port: 5432,
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})