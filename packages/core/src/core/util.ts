/**
 * Checks if `value` is a `function`.
 * @param value The value to check
 * @returns Returns `true` if `value` is a function, else `false`.
 */
export function isFunction(value: any): value is (...args: any[]) => any {
	return typeof value === "function";
}

export const slice = Array.prototype.slice;

export const noop = () => {};
