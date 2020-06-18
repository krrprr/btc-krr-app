import { AxiosError } from 'axios';
import express, { Request, Response } from 'express';
import { Observable, PartialObserver } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { getBlock$, getBlockCount$, getBlockHash$ } from './rpc';
import { Block } from './types/block';

const router: express.Router = express.Router();

router.get('/getblockcount', (_request: Request, response: Response) => {
  handleGetBlockCount(handleResponse(response));
});

router.get('/getlastblock', (_request: Request, response: Response) => {
  handleGetLastBlock(handleResponse(response));
});

const handleGetBlockCount = (
  responseHandler: PartialObserver<number>
): void => {
  getBlockCount$().subscribe(responseHandler);
};

const handleGetLastBlock = (responseHandler: PartialObserver<Block>): void => {
  getLastBlock$(
    getBlockCount$,
    (count: number) => getBlockHash$(count),
    (hash: string) => getBlock$(hash)
  ).subscribe(responseHandler);
};

const getLastBlock$ = (
  blockCount$: () => Observable<number>,
  blockHash$: (count: number) => Observable<string>,
  block$: (hash: string) => Observable<Block>
): Observable<Block> => {
  return blockCount$().pipe(mergeMap(blockHash$), mergeMap(block$));
};

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

export { router, getLastBlock$ };
