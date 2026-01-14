import pool from "../models/db.js";

// Get all areas for a specific campaign
export const getAreas = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM area WHERE campaign_id = $1 ORDER BY created_at ASC', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching areas');
    }
}

// get the details on a specific area
export const getAreaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM area WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching area');
    }
}

export const createArea = async (req, res) => {
    const { name, description, area_type_id, campaign_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO area (name, description, type_id, campaign_id) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, area_type_id, campaign_id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating area');
    }
}

export const getAreaTypes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM area_type ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching area types');
    }
}

export const createAreaType = async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query('INSERT INTO area_type (name) VALUES ($1) RETURNING *', [name]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating area type');
    }
}