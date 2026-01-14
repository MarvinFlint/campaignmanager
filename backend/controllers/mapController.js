import pool from "../models/db.js";

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
export const getMapById = async (req, res) => {
    const { id } = req.params;
    try {
        // Include the area's campaign_id so the client can know which campaign
        // this map belongs to without requiring an extra lookup.
        const result = await pool.query(`
            SELECT m.*, a.campaign_id
            FROM map m
            LEFT JOIN area a ON m.area_id = a.id
            WHERE m.id = $1
        `, [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching map');
    }
}

// Get VTT state (tokens, ui, etc.) for a specific map
export const getMapVttState = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT vtt_state FROM map WHERE id = $1', [id]);
        const row = result.rows[0];
        res.json(row && row.vtt_state ? row.vtt_state : {});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching map VTT state');
    }
}

// Save VTT state for a specific map (replace entire vtt_state JSON)
export const saveMapVttState = async (req, res) => {
    const { id } = req.params;
    const state = req.body;
    try {
        const result = await pool.query('UPDATE map SET vtt_state = $1 WHERE id = $2 RETURNING vtt_state', [state, id]);
        res.json(result.rows[0].vtt_state);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving map VTT state');
    }
}

export const createMap = async (req, res) => {  
    // DB columns: title, notes, image, area_id
    const { title, notes, area_id } = req.body;
    // multer stores the uploaded file in req.file when upload.single('image') used
    let imageBuffer = null;
    if (req.file && req.file.buffer) {
        imageBuffer = req.file.buffer;
    }
    try {
        const result = await pool.query(
            'INSERT INTO map (title, notes, image, area_id) VALUES ($1, $2, $3, $4) RETURNING *', 
            [title, notes, imageBuffer, area_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating map');
    }
}

// Serve map image as binary with MIME detection
export const getMapImage = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT image FROM map WHERE id = $1', [id]);
        const row = result.rows[0];
        if (!row || !row.image) {
            return res.status(404).send('No image');
        }

        const imgBuffer = row.image;
        // Basic MIME sniff by checking magic bytes for PNG/JPEG/GIF
        let mime = 'application/octet-stream';
        if (imgBuffer.slice(0, 8).equals(Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))) {
            mime = 'image/png';
        } else if (imgBuffer.slice(0,3).equals(Buffer.from([0xFF,0xD8,0xFF]))) {
            mime = 'image/jpeg';
        } else if (imgBuffer.slice(0,6).toString('ascii').includes('GIF')) {
            mime = 'image/gif';
        }

        res.setHeader('Content-Type', mime);
        res.send(imgBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching image');
    }
}

// Update map metadata (title, notes)
export const updateMap = async (req, res) => {
    const { id } = req.params;
    const { title, notes } = req.body;
    try {
        const result = await pool.query(
            'UPDATE map SET title = $1, notes = $2 WHERE id = $3 RETURNING *',
            [title, notes, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Map not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating map');
    }
}

// Upload or replace the image for a map
export const uploadMapImage = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).send('No file uploaded');
        }
        const imageBuffer = req.file.buffer;
        const result = await pool.query(
            'UPDATE map SET image = $1 WHERE id = $2 RETURNING *',
            [imageBuffer, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Map not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading image');
    }
}