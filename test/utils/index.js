export * from './assertion';
export * from './db';
export * from './state';

/**
 * Promise-based timeout
 * @param {number} ms
 * @return {promise}
 */
export function timer(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}