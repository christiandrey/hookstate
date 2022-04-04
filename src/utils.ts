export function pipeline<T extends (...args: unknown[]) => any>(fns: Array<T>) {
	return (...args: Parameters<T>) => {
		let res: ReturnType<T> | undefined;

		for (let i = 0; i < fns.length; i++) {
			const fn = fns[i];
			res = i ? fn(res) : fn(...args);
		}

		return res as ReturnType<T>;
	};
}

export function identity<T>(i: T) {
	return i;
}
