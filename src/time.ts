export function waitForDelay(ms: number = 0, controller?: AbortController): Promise<void> {
  return new Promise((resolve, reject) => {
    if(controller) {
      controller.signal.addEventListener('abort', reject);
    }
    setTimeout(resolve, ms);
  });
}