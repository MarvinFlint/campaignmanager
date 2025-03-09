import express from 'express';
import cors from 'cors';
import campaignRoutes from './routes/campaigns.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Use routes
app.use('/campaigns', campaignRoutes);

app.listen(port, () => {
    console.log(`Module Manager backend listening on port ${port}`);
});
