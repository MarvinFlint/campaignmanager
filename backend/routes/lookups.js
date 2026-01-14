import express from 'express';
import { getRaces, getClasses, getAlignments } from '../controllers/lookupController.js';

const router = express.Router();

router.get('/races', getRaces);
router.get('/classes', getClasses);
router.get('/alignments', getAlignments);

export default router;
