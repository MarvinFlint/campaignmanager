import express from 'express';
import { getCharacters, getCampaignCharacters, getCharacterById, createCharacter, copyCharacter } from '../controllers/characterController.js';

const router = express.Router(); 

router.get('/character/:id', getCharacterById);
router.get('/:id', getCampaignCharacters);
router.post('/copy', copyCharacter);
router.get('/', getCharacters);
router.post('/', createCharacter);


export default router;