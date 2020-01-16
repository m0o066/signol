# Signol

Sign~~a~~**o**l is a signaling utils for web development.

## Getting Started

### Install

```
npm i -S signol
```

### Usage

```typescript
import { on, once, wait, off, emit } from 'signol';

function callback(signalName: string, ...args: any[]): void {
  console.log( ... );
}

// subscribe for specific signal
on('foo', callback);
once('foo', callback);

// wait for specific signal before moving on
await wait('foo');

// unsubscribe from specific signal, or all signals
off('foo', callback);
off('foo');
off();

// emit a signal
emit('foo');
emit('foo', 'bar', 123);
```
