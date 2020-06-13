import dotenv from 'dotenv';
import express from 'express';
import { router } from './api';

dotenv.config();
const app: express.Application = express();

app.use('/api', router);

const port: string | undefined = process.env?.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));
