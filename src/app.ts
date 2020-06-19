import dotenv from 'dotenv';
import express from 'express';
import { router } from './api';

const validateConfig = (): void => {
  const configVariables: string[] = [
    'PORT',
    'BITCOIND_RPC_USER',
    'BITCOIND_RPC_PASSWORD',
    'BITCOIND_RPC_HOST',
    'BITCOIND_RPC_PORT',
  ];
  const missingValues: string[] = configVariables.filter(
    (key: string) => !process.env[key]
  );
  if (missingValues.length) {
    throw new Error(
      `Value not found for ${missingValues.join(
        ', '
      )}. Update .env file and try again.`
    );
  }
};

dotenv.config();
validateConfig();
const app: express.Application = express();

app.use('/api', router);

const port: string = process.env.PORT!;
app.listen(port, () => console.log(`Listening on port ${port}`));
