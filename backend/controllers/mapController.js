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