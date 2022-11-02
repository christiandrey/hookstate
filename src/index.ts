import {HookState} from './types';
import {identity, pipeline} from './utils';

type Middleware<T> = (value: T) => T;

export function createHookState<T>(
	initialValue: T,
	middlewares: Array<Middleware<T>> = [],
): HookState<T> {
	const SUBSCRIBERS: Array<(state: T) => void> = [];
	let STATE: T = initialValue;

	function get() {
		return STATE;
	}

	function set(value: T | ((state: T) => T)) {
		STATE = pipeline([identity, ...middlewares])(value instanceof Function ? value(STATE) : value);

		for (const subscriber of SUBSCRIBERS) {
			subscriber(STATE);
		}
	}

	function subscribe(callback: (state: T) => void) {
		SUBSCRIBERS.push(callback);

		return () => {
			unsubscribe(callback);
		};
	}

	function unsubscribe(callback: (state: T) => void) {
		const index = SUBSCRIBERS.indexOf(callback);

		if (!~index) {
			return;
		}

		SUBSCRIBERS.splice(index, 1);
	}

	function unsubscribeAll() {
		SUBSCRIBERS.length = 0;
	}

	return {
		get,
		set,
		subscribe,
		unsubscribe,
		unsubscribeAll,
	};
}

export * from './hooks';
