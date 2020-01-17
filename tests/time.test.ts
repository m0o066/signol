import { waitForDelay } from "../src";
import AbortController from 'abort-controller';

function mark(t0: number = 0): number {
  return new Date().getTime() - t0;
}

function getDurationRange(duration: number, range: number): number[] {
  return [
    duration * (1 - range),
    duration * (1 + range),
  ]
}

describe('Time Utils', () => {
  const delay = 1000;
  const abortDelay = delay / 2;

  // within what time range do we expected `waitForDelay` to wait
  const range = 0.1;
  const [r1, r2] = getDurationRange(delay, range);
  const [r3, r4] = getDurationRange(abortDelay, range);

  test('should pause specific amount of time before moving on', async () => {
    const t0 = mark();
    const endNormally = await waitForDelay(delay);
    const elapsed = mark(t0);

    expect(elapsed).toBeGreaterThanOrEqual(r1);
    expect(elapsed).toBeLessThanOrEqual(r2);
    expect(endNormally).toEqual(true);
  });

  test('should support abort waiting', async () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), abortDelay);

    const t0 = mark();
    const endNormally = await waitForDelay(delay, controller);
    const elapsed = mark(t0);

    expect(elapsed).toBeGreaterThanOrEqual(r3);
    expect(elapsed).toBeLessThanOrEqual(r4);
    expect(endNormally).toEqual(false);
  });
});