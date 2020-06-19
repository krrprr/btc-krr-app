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
  type TestInput = {
    blockCountMarbles: string;
    blockHashMarbles: string;
    blockMarbles: string;
    blockValue?: { [key: string]: Block };
    expectedMarbles: string;
    expectedValues?: { [key: string]: Block };
  };

  const runTest = (input: TestInput): void => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const blockCount$ = (): Observable<number> =>
        cold(input.blockCountMarbles);
      const blockHash$ = (): Observable<string> => cold(input.blockHashMarbles);
      const block$ = (): Observable<Block> =>
        input.blockValue
          ? cold(input.blockMarbles, input.blockValue)
          : cold(input.blockMarbles);

      const result$ = getLastBlock$(blockCount$, blockHash$, block$);
      expectObservable(result$).toBe(
        input.expectedMarbles,
        input.expectedValues
      );
    });
  };

  it('maps to the block$ value after completing all observables', () => {
    const block = { hash: '123abc', height: 555, confirmations: 1 } as Block;
    runTest({
      blockCountMarbles: '200ms (a|)',
      blockHashMarbles: '100ms (b|)',
      blockMarbles: '300ms (c|)',
      blockValue: { c: block },
      expectedMarbles: '600ms (c|)',
      expectedValues: { c: block },
    });
  });

  it('errors in case of blockCount$ error', () => {
    runTest({
      blockCountMarbles: '200ms #',
      blockHashMarbles: '100ms (b|)',
      blockMarbles: '300ms (c|)',
      expectedMarbles: '200ms #',
    });
  });

  it('errors in case of blockHash$ error', () => {
    runTest({
      blockCountMarbles: '200ms (a|)',
      blockHashMarbles: '100ms #',
      blockMarbles: '300ms (c|)',
      expectedMarbles: '300ms #',
    });
  });

  it('errors in case of block$ error', () => {
    runTest({
      blockCountMarbles: '200ms (a|)',
      blockHashMarbles: '100ms (b|)',
      blockMarbles: '300ms #',
      expectedMarbles: '600ms #',
    });
  });
});
