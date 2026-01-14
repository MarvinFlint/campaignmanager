import pool from '../models/db.js';

export const getRaces = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM race ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching races');
    }
};

export const getClasses = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM class ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching classes');
    }
};

export const getAlignments = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM alignment ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching alignments');
    }
};
