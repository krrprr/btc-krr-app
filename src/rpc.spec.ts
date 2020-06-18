import * as axios from 'axios';
import { getBlock$, getBlockCount$, getBlockHash$ } from './rpc';
import { Block } from './types/block';

jest.mock('axios');

const postRequestError = (code: number): void => {
  // @ts-ignore
  axios.post.mockImplementation(() => Promise.reject(code));
};

const postRequestSuccess = (result: any): void => {
  // @ts-ignore
  axios.post.mockImplementation(() =>
    Promise.resolve({ data: { result: result } })
  );
};

describe('getBlockCount$', () => {
  it('post request rejects', (done) => {
    postRequestError(404);
    getBlockCount$().subscribe(undefined, (err) => {
      expect(err).toEqual(404);
      done();
    });
  });

  it('post request resolves', (done) => {
    postRequestSuccess(1234);
    getBlockCount$().subscribe((value: number) => {
      expect(value).toEqual(1234);
      done();
    });
  });
});

describe('getBlockHash$', () => {
  it('post request rejects', (done) => {
    postRequestError(404);
    getBlockHash$(1000).subscribe(undefined, (err) => {
      expect(err).toEqual(404);
      done();
    });
  });

  it('post request resolves', (done) => {
    postRequestSuccess('12345');
    getBlockHash$(1000).subscribe((value: string) => {
      expect(value).toEqual('12345');
      done();
    });
  });
});

describe('getBlock$', () => {
  it('post request rejects', (done) => {
    postRequestError(404);
    getBlock$('111').subscribe(undefined, (err) => {
      expect(err).toEqual(404);
      done();
    });
  });

  it('post request resolves', (done) => {
    const mockBlock = {
      hash: '999',
      confirmations: 10,
      height: 444,
    };
    postRequestSuccess(mockBlock);
    getBlock$('999').subscribe((value: Block) => {
      expect(value).toEqual(mockBlock);
      done();
    });
  });
});
