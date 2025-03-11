import pool from "../models/db.js";

// get all characters
export const getCharacters = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM character ORDER BY created_at ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching characters');
    }
}

// Get all characters for a specific campaign
export const getCampaignCharacters = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM character WHERE campaign_id = $1 ORDER BY created_at ASC', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching characters');
    }
}

// Get the details on a specific character
export const getCharacterById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM character WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching character');
    }
}

// Create a character in a given campaign
export const createCharacter = async (req, res) => {
    const { name, description, campaign_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO character (name, description, campaign_id) VALUES ($1, $2, $3) RETURNING *', [name, description, campaign_id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating character');
    }
}

// TODO: Copy a character to a different campaign
export const copyCharacter = async (req, res) => {
    const { character_id, campaign_id } = req.body;
    try {
        const result = await pool.query('SELECT * FROM character WHERE id = $1', [character_id]);
        const character = result.rows[0];
        const newCharacter = await pool.query('INSERT INTO character (name, description, campaign_id) VALUES ($1, $2, $3) RETURNING *', [character.name, character.description, campaign_id]);
        res.json(newCharacter.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error copying character');
    }
}