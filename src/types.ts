export type SignalName = string | symbol;

export interface SignalCallback {
  (signalName: SignalName, ...args: any[]): void;
}

export interface SignalHandler {
  callback: SignalCallback;
  once?: boolean;
}
