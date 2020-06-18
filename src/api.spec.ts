import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { getLastBlock$ } from './api';
import { Block } from './types/block';

let testScheduler: TestScheduler;

beforeEach(() => {
  testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
});

describe('getLastBlock$', () => {
  it('maps to the block$ value after completing all observables', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const block = { hash: '123abc', height: 555, confirmations: 1 } as Block;

      const blockCount$ = (): Observable<number> =>
        cold('200ms (a |)', { a: 555 });
      const blockHash$ = (): Observable<string> =>
        cold('100ms (b |)', { b: '123abc' });
      const block$ = (): Observable<Block> => cold('300ms (c |)', { c: block });

      const result$ = getLastBlock$(blockCount$, blockHash$, block$);
      const expected = '600ms (c |)';
      expectObservable(result$).toBe(expected, { c: block });
    });
  });
});
