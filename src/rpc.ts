import axios from 'axios';
import { from, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

const getBlockCount$ = (): Observable<number> => {
  return createPostRequest$('getblockcount');
};

const getBlockHash$ = (blockHeight: number): Observable<string> => {
  return createPostRequest$('getblockhash', [blockHeight]);
};

const getBlock$ = (blockHash: string): Observable<any> => {
  return createPostRequest$('getblock', [blockHash]);
};

function createPostRequest$<T>(
  methodName: string,
  params: any[] = []
): Observable<T> {
  const USER: string | undefined = process.env?.BITCOIND_RPC_USER;
  const PASSWORD: string | undefined = process.env?.BITCOIND_RPC_PASSWORD;
  const PORT: string | undefined = process.env?.BITCOIND_RPC_PORT;
  const HOST: string | undefined = process.env?.BITCOIND_RPC_HOST;

  return from(
    axios.post(`http://${USER}:${PASSWORD}@${HOST}:${PORT}/`, {
      jsonrpc: '1.0',
      id: 'curltext',
      method: methodName,
      params: params,
    })
  ).pipe(pluck('data', 'result'));
}

export { getBlockCount$, getBlockHash$, getBlock$ };
