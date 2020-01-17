import { on, once, wait, off, emit, waitForDelay } from '../src';

jest.useFakeTimers();

describe('Signal', () => {
  describe('signal type', () => {
    beforeEach(() => off());

    test('should support both string and symbol as signal name', () => {
      const stringSignalCallback = jest.fn();
      const anonymousSymbolSignalCallback = jest.fn();
      const namedSymbolSignalCallback = jest.fn();

      const stringSignalName = 'foo';
      const anonymousSymbolSignalName = Symbol();
      const namedSymbolSignalName = Symbol('foo');

      on(stringSignalName, stringSignalCallback);
      on(anonymousSymbolSignalName, anonymousSymbolSignalCallback);
      on(namedSymbolSignalName, namedSymbolSignalCallback);

      emit(stringSignalName);
      emit(anonymousSymbolSignalName);
      emit(namedSymbolSignalName);
      
      jest.runAllTimers();
      expect(stringSignalCallback).toHaveBeenCalledTimes(1);
      expect(anonymousSymbolSignalCallback).toHaveBeenCalledTimes(1);
      expect(namedSymbolSignalCallback).toHaveBeenCalledTimes(1);
    })
  });

  describe('on', () => {
    beforeEach(() => off());

    test('should invoke callback when signal is emitted', () => {
      const callback = jest.fn();
      on('foo', callback);
      emit('foo');

      jest.runAllTimers();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not invoke callback if signal is emiited before handler is registed', () => {
      const callback = jest.fn();
      emit('foo');
      on('foo', callback);

      jest.runAllTimers();
      expect(callback).not.toHaveBeenCalled();
    });

    test('should invoke callback once for every signal emitted', () => {
      const callback = jest.fn();
      on('foo', callback);
      on('foo', callback);
      on('bar', callback);
      on('foo', callback);
      emit('foo');
      emit('wah');

      jest.runAllTimers();
      expect(callback).toHaveBeenCalledTimes(3);
    });

    test('should not invoke callback if no signal is emitted', () => {
      const callback = jest.fn();
      on('foo', callback);

      jest.runAllTimers();
      expect(callback).not.toHaveBeenCalled();
    });

    test('should get signal name and arguments from callback', done => {
      function callback(name: string, arg1?: any, arg2?: any): void {
        expect(name).toEqual('foo');
        expect(arg1).toEqual('bar');
        expect(arg2).toBeUndefined();
        done();
      }

      on('foo', callback);
      emit('foo', 'bar');
      jest.runAllTimers();
    });
  });

  describe('once', () => {
    beforeEach(() => off());

    test('should invoke callback when signal is emitted', () => {
      const callback = jest.fn();
      once('foo', callback);
      emit('foo');

      jest.runAllTimers();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should invoke callback only once if multiple signals are emitted', () => {
      const callback = jest.fn();
      once('foo', callback);
      emit('foo');
      emit('foo');
      emit('wah');
      emit('foo');

      jest.runAllTimers();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('off', () => {
    test('should not invoke callback after calling off', () => {
      const callback = jest.fn();
      on('foo', callback);
      off('foo', callback);
      emit('foo');

      jest.runAllTimers();
      expect(callback).not.toHaveBeenCalled();
    });

    test('should remove all handlers of the same signal', () => {
      const fooCb = jest.fn();
      const barCb = jest.fn();
      on('foo', fooCb);
      on('foo', fooCb);
      on('foo', barCb);
      off('foo');
      emit('foo');

      jest.runAllTimers();
      expect(fooCb).not.toHaveBeenCalled();
      expect(barCb).not.toHaveBeenCalled();
    });

    test('should clear all signal handlers', () => {
      const fooCb = jest.fn();
      const barCb = jest.fn();
      on('foo', fooCb);
      on('foo', fooCb);
      on('bar', barCb);
      off();
      emit('foo');
      emit('bar');

      jest.runAllTimers();
      expect(fooCb).not.toHaveBeenCalled();
      expect(barCb).not.toHaveBeenCalled();
    });
  });

  describe('wait for signal', () => {
    test('should wait for specific signal before moving on', done => {
      wait('foo').then(done);

      waitForDelay(1000).then(() => {
        emit('foo');
        jest.runOnlyPendingTimers();
      });
      
      jest.runOnlyPendingTimers();
    });

    test('should reject if wait for signal timed out', () => {
      const promise = expect(wait('foo', 100)).rejects.toThrow('timeout');
      jest.runAllTimers();
      return promise;
    })
  });
});