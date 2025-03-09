import pool from '../models/db.js';

// Get all campaigns
export const getCampaigns = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM campaign ORDER BY created_at ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching campaigns');
    }
};

// Get campaign by ID
export const getCampaignById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM campaign WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching campaign');
    }
};

// Create a new campaign
export const createCampaign = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO campaign (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating campaign');
    }
};

export const updateCampaign = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE campaign SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating campaign');
    }
}