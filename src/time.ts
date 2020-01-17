export function waitForDelay(ms: number = 0, controller?: AbortController): Promise<boolean> {
  return new Promise(resolve => {
    if(controller) {
      controller.signal.addEventListener('abort', () => resolve(false));
    }
    setTimeout(() => resolve(true), ms);
  });
}