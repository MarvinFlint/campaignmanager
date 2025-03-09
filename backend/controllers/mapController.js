import pool from "../models/db";

// Get all maps for a specific area
export const getMaps = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM map WHERE area_id = $1 ORDER BY created_at ASC', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching maps');
    }
}

// Get the details on a specific map
export const getMap = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM map WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching map');
    }
}

export const createMap = async (req, res) => {  
    const { name, description, image, area_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO map (name, description, image, area_id) VALUES ($1, $2, $3, $4) RETURNING *', 
            [name, description, image, area_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating map');
    }
}