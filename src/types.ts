export interface SignalCallback {
  (signalName: string, ...args: any[]): void;
}

export interface SignalHandler {
  callback: SignalCallback;
  once?: boolean;
}

export interface SignalHandlers {
  [signalName: string]: SignalHandler[];
}