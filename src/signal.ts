import { SignalCallback, SignalHandlers } from './types';

let handlers: SignalHandlers = {};

export function on(signalName: string, callback: SignalCallback): void {
  addHandler(signalName, callback, false);
}

export function once(signalName: string, callback: SignalCallback): void {
  addHandler(signalName, callback, true);
}

export function wait(signalName: string, timeout: number = 0): Promise<void> {
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

export function off(signalName?: string, callback?: SignalCallback): void {
  if(signalName && callback) removeHandler(signalName, callback);
  else if(signalName) removeAllCallbacksOfSignal(signalName);
  else removeAllCallbacks();
}

export function emit(signalName: string, ...args: any[]) {
  // invoke all callbacks of specific signal
  const {[signalName]: signalHandlers = []} = handlers;
  for(let i=0; i<signalHandlers.length; ++i) {
    const { callback, once } = signalHandlers[i];
    setTimeout(() => callback(signalName, ...args), 0);

    // if it is a one time handler, remove it from the list
    if(once) signalHandlers.splice(i--, 1);
  }
}

function addHandler(signalName: string, callback: SignalCallback, once: boolean = false): void {
  if(!handlers[signalName]) {
    handlers[signalName] = [];
  }
  handlers[signalName].push({ callback, once });
}

function removeHandler(signalName: string, callback: SignalCallback): boolean {
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

function removeAllCallbacksOfSignal(signalName: string): void {
  delete handlers[signalName];
}

function removeAllCallbacks(): void {
  handlers = {};
}