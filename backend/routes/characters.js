import express from 'express';
import { getCharacters, getCampaignCharacters, getCharacterById, createCharacter, copyCharacter } from '../controllers/characterController.js';

const router = express.Router(); 

router.get('/', getCharacters);
router.get('/:id', getCampaignCharacters);
router.get('/character/:id', getCharacterById);
router.post('/', createCharacter);
router.post('/copy', copyCharacter);

export default router;