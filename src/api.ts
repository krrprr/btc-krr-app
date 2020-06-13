import { AxiosError } from 'axios';
import express, { Request, Response } from 'express';
import { getBlockCount$ } from './rpc';

const router: express.Router = express.Router();

router.get('/getblockcount', (_request: Request, response: Response) => {
  getBlockCount$().subscribe({
    next: (value: number) => {
      response.send({ value });
    },
    error: (error: AxiosError) => {
      response.status(500).send({
        message: error.message,
      });
    },
  });
});

export { router };
