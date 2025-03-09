import express from 'express';
import cors from 'cors';
import campaignRoutes from './routes/campaigns.js';
import characterRoutes from './routes/characters.js';
import mapRoutes from './routes/maps.js';
import areaRoutes from './routes/areas.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Use routes
app.use('/campaigns', campaignRoutes);
app.use('/characters', characterRoutes);
app.use('/maps', mapRoutes);
app.use('/areas', areaRoutes);


app.listen(port, () => {
    console.log(`Module Manager backend listening on port ${port}`);
});
