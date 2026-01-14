import pool from '../models/db.js';

// Get all spells
export const getSpells = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM spell ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching spells');
    }
}

// Get spell by ID
export const getSpellById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM spell WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching spell');
    }
}

// Create a new spell
export const createSpell = async (req, res) => {
    const { name, school_id, sphere_id, casting_time, range, area_of_effect, components, duration, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO spell (name, school_id, sphere_id, casting_time, range, area_of_effect, components, duration, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [name, school_id, sphere_id, casting_time, range, area_of_effect, components, duration, description]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating spell');
    }
}

// Update an existing spell
export const updateSpell = async (req, res) => {
    const { id } = req.params;
    const { name, school_id, sphere_id, casting_time, range, area_of_effect, components, duration, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE spell SET name = $1, school_id = $2, sphere_id = $3, casting_time = $4, range = $5, area_of_effect = $6, components = $7, duration = $8, description = $9 WHERE id = $10 RETURNING *',
            [name, school_id, sphere_id, casting_time, range, area_of_effect, components, duration, description, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating spell');
    }
}

// Delete a spell
export const deleteSpell = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM spell WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting spell');
    }
}   