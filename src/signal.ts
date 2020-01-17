import { SignalCallback, SignalName, SignalHandler } from './types';

let handlers = {};

export function on(signalName: SignalName, callback: SignalCallback): void {
  addHandler(signalName, callback, false);
}

export function once(signalName: SignalName, callback: SignalCallback): void {
  addHandler(signalName, callback, true);
}

export function wait(signalName: SignalName, timeout: number = 0): Promise<void> {
  return new Promise((resolve, reject) => {
    const callback = () => resolve();
    once(signalName, callback);

    if(timeout > 0) {
      setTimeout(() => {
        off(signalName, callback);
        reject(new Error('timeout'));
      }, timeout);
    }
  });
}

export function off(signalName?: SignalName, callback?: SignalCallback): void {
  if(signalName && callback) removeHandler(signalName, callback);
  else if(signalName) removeAllCallbacksOfSignal(signalName);
  else removeAllCallbacks();
}

export function emit(signalName: SignalName, ...args: any[]) {
  // invoke all callbacks of specific signal
  const signalHandlers: SignalHandler[] = handlers[signalName] || [];
  for(let i=0; i<signalHandlers.length; ++i) {
    const { callback, once } = signalHandlers[i];
    setTimeout(() => callback(signalName, ...args), 0);

    // if it is a one time handler, remove it from the list
    if(once) signalHandlers.splice(i--, 1);
  }
}

function addHandler(signalName: SignalName, callback: SignalCallback, once: boolean = false): void {
  if(!handlers[signalName]) {
    handlers[signalName] = [];
  }
  handlers[signalName].push({ callback, once });
}

function removeHandler(signalName: SignalName, callback: SignalCallback): boolean {
  if(handlers[signalName]) {
    for(let i=0; i<handlers[signalName].length; ++i) {
      if(handlers[signalName][i].callback === callback) {
        handlers[signalName].splice(i, 1);
        return true;
      }
    }
  }
  return false;
}

function removeAllCallbacksOfSignal(signalName: SignalName): void {
  delete handlers[signalName];
}

function removeAllCallbacks(): void {
  handlers = {};
}