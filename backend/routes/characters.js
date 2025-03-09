import express from 'express';
import { getCharacters, getCharacterById, createCharacter, copyCharacter } from '../controllers/characterController.js';

const router = express.Router(); 

router.get('/:id', getCharacters);
router.get('/character/:id', getCharacterById);
router.post('/', createCharacter);
router.post('/copy', copyCharacter);

export default router;