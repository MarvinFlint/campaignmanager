import express from 'express';
import { getMaps, getMapById, createMap } from '../controllers/mapController.js';

const router = express.Router();

router.get('/:id', getMaps);
router.get('/map/:id', getMapById);
router.post('/', createMap);

export default router;