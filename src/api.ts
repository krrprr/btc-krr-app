import { AxiosError } from 'axios';
import express, { Request, Response } from 'express';
import { PartialObserver, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { getBlock$, getBlockCount$, getBlockHash$ } from './rpc';
import { Block } from './types/block';

const router: express.Router = express.Router();

router.get('/getblockcount', (_request: Request, response: Response) => {
  getBlockCount$().subscribe(handleResponse(response));
});

router.get('/getlastblock', (_request: Request, response: Response) => {
  const lastBlock$: Observable<Block> = getBlockCount$().pipe(
    mergeMap((count: number) => getBlockHash$(count)),
    mergeMap((hash: string) => getBlock$(hash))
  );
  lastBlock$.subscribe(handleResponse(response));
});

function handleResponse<T>(response: Response): PartialObserver<T> {
  return {
    next: (value: T): void => {
      response.send({ value });
    },
    error: (error: AxiosError): void => {
      response.status(500).send({ message: error.message });
    },
  };
}

export { router };
