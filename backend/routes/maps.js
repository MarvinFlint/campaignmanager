import express from 'express';
import multer from 'multer';
import { getMaps, getMapById, createMap, getMapImage, updateMap, uploadMapImage } from '../controllers/mapController.js';
import { getMapVttState, saveMapVttState } from '../controllers/mapController.js';

const router = express.Router();
const upload = multer();

router.get('/:id/image', getMapImage);
router.get('/:id/state', getMapVttState);
router.get('/:id', getMaps);
router.get('/map/:id', getMapById);
router.post('/', upload.single('image'), createMap);
router.put('/:id/state', express.json(), saveMapVttState);
router.patch('/:id', express.json(), updateMap);
router.post('/:id/image', upload.single('image'), uploadMapImage);

export default router;