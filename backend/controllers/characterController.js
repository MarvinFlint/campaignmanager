import pool from "../models/db.js";

// get all characters
export const getCharacters = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, r.name AS race_name, al.name AS alignment_name
            FROM character c
            LEFT JOIN race r ON c.race_id = r.id
            LEFT JOIN alignment al ON c.alignment_id = al.id
            ORDER BY c.created_at ASC
        `);
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
        const result = await pool.query(`
            SELECT c.*, r.name AS race_name, al.name AS alignment_name
            FROM character c
            LEFT JOIN race r ON c.race_id = r.id
            LEFT JOIN alignment al ON c.alignment_id = al.id
            WHERE c.campaign_id = $1
            ORDER BY c.created_at ASC
        `, [id]);
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
        // Main character row with race/alignment names
        const result = await pool.query(`
            SELECT c.*, r.name AS race_name, al.name AS alignment_name
            FROM character c
            LEFT JOIN race r ON c.race_id = r.id
            LEFT JOIN alignment al ON c.alignment_id = al.id
            WHERE c.id = $1
        `, [id]);
        const character = result.rows[0];

        if (!character) {
            return res.status(404).send('Character not found');
        }

        // Fetch classes and levels
        const classesRes = await pool.query(`
            SELECT cc.class_id AS id, cl.name, cc.level
            FROM character_class cc
            LEFT JOIN class cl ON cc.class_id = cl.id
            WHERE cc.character_id = $1
            ORDER BY cc.level ASC
        `, [id]);
        character.classes = classesRes.rows;

        // Fetch ability scores
        const abilityRes = await pool.query('SELECT * FROM ability_score WHERE character_id = $1', [id]);
        character.ability_scores = abilityRes.rows[0] || null;

        // Fetch saving throws
        const savingRes = await pool.query('SELECT * FROM saving_throw WHERE character_id = $1', [id]);
        character.saving_throws = savingRes.rows[0] || null;

        // Fetch spells (joined with spell table)
        const spellsRes = await pool.query(`
            SELECT s.id, s.name, s.description, cs."hasLearned" AS has_learned
            FROM character_spell cs
            LEFT JOIN spell s ON cs.spell_id = s.id
            WHERE cs.character_id = $1
        `, [id]);
        character.spells = spellsRes.rows;

        // Fetch inventory items with properties
        const itemsRes = await pool.query(`
            SELECT i.id, i.name, ip.ac, ip.ac_magical, ip.weight
            FROM item i
            LEFT JOIN item_property ip ON ip.item_id = i.id
            LEFT JOIN character_inventory ci ON i.character_inventory_id = ci.id
            WHERE ci.character_id = $1
        `, [id]);
        character.inventory = itemsRes.rows;

        res.json(character);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching character');
    }
}

// Get class names and levels for a character
export const getCharacterClasses = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT cc.class_id AS id, cl.name, cc.level
            FROM character_class cc
            LEFT JOIN class cl ON cc.class_id = cl.id
            WHERE cc.character_id = $1
            ORDER BY cc.level ASC
        `, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching character classes:', error);
        res.status(500).send('Error fetching character classes');
    }
}

// Create a character in a given campaign
export const createCharacter = async (req, res) => {
    const {
        campaign_id,
        first_name,
        last_name,
        race_id,
        alignment_id,
        hit_points_total,
        hit_points_current,
        hit_points_temporary,
        armor_class,
        isNPC,
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO character (
                campaign_id,
                first_name,
                last_name,
                race_id,
                alignment_id,
                hit_points_total,
                hit_points_current,
                hit_points_temporary,
                armor_class,
                "isNPC"
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [
                campaign_id,
                first_name,
                last_name,
                race_id,
                alignment_id,
                hit_points_total || null,
                hit_points_current || null,
                hit_points_temporary || null,
                armor_class || null,
                isNPC || false,
            ]
        );
        const created = result.rows[0];

        // If client provided a class_id, create a character_class link (default level 1)
        if (req.body.class_id) {
            try {
                await pool.query(
                    'INSERT INTO character_class (character_id, class_id, level) VALUES ($1, $2, $3)',
                    [created.id, req.body.class_id, req.body.class_level || 1]
                );
            } catch (err) {
                console.error('Error creating character_class link:', err);
                // non-fatal for character creation — continue
            }
        }

        res.json(created);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating character');
    }
}



// Update character core fields and classes
export const updateCharacter = async (req, res) => {
    const { id } = req.params;
    const {
        first_name,
        last_name,
        hit_points_total,
        hit_points_current,
        hit_points_temporary,
        armor_class,
        classes // expected: [{ id: class_id, level: number }, ...]
    } = req.body;

    try {
        // Update basic character fields
        await pool.query(
            `UPDATE character SET first_name = $1, last_name = $2, hit_points_total = $3, hit_points_current = $4, hit_points_temporary = $5, armor_class = $6 WHERE id = $7`,
            [first_name || null, last_name || null, hit_points_total || null, hit_points_current || null, hit_points_temporary || null, armor_class || null, id]
        );

        // If classes provided, replace existing entries for simplicity
        if (Array.isArray(classes)) {
            // remove existing
            await pool.query('DELETE FROM character_class WHERE character_id = $1', [id]);
            // insert new
            for (const cls of classes) {
                if (!cls || !cls.id) continue;
                const level = cls.level || 1;
                await pool.query('INSERT INTO character_class (character_id, class_id, level) VALUES ($1, $2, $3)', [id, cls.id, level]);
            }
        }

        // Return updated character (reuse existing query)
        const result = await pool.query(`
            SELECT c.*, r.name AS race_name, al.name AS alignment_name
            FROM character c
            LEFT JOIN race r ON c.race_id = r.id
            LEFT JOIN alignment al ON c.alignment_id = al.id
            WHERE c.id = $1
        `, [id]);
        const character = result.rows[0];

        // attach classes and other related data similar to getCharacterById
        const classesRes = await pool.query(`
            SELECT cc.class_id AS id, cl.name, cc.level
            FROM character_class cc
            LEFT JOIN class cl ON cc.class_id = cl.id
            WHERE cc.character_id = $1
            ORDER BY cc.level ASC
        `, [id]);
        character.classes = classesRes.rows;

        const abilityRes = await pool.query('SELECT * FROM ability_score WHERE character_id = $1', [id]);
        character.ability_scores = abilityRes.rows[0] || null;

        const savingRes = await pool.query('SELECT * FROM saving_throw WHERE character_id = $1', [id]);
        character.saving_throws = savingRes.rows[0] || null;

        const spellsRes = await pool.query(`
            SELECT s.id, s.name, s.description, cs."hasLearned" AS has_learned
            FROM character_spell cs
            LEFT JOIN spell s ON cs.spell_id = s.id
            WHERE cs.character_id = $1
        `, [id]);
        character.spells = spellsRes.rows;

        const itemsRes = await pool.query(`
            SELECT i.id, i.name, ip.ac, ip.ac_magical, ip.weight
            FROM item i
            LEFT JOIN item_property ip ON ip.item_id = i.id
            LEFT JOIN character_inventory ci ON i.character_inventory_id = ci.id
            WHERE ci.character_id = $1
        `, [id]);
        character.inventory = itemsRes.rows;

        res.json(character);
    } catch (error) {
        console.error('Error updating character:', error);
        res.status(500).send('Error updating character');
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