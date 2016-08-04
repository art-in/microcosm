export function newIdStr() {
    let arr = new Array(24).fill(0);
    arr = arr.map(() => Math.floor(Math.random() * 10));
    let result = arr.join('');
    return result;
}

export function mapObject(target, source) {
    Object.keys(target).forEach(prop => {
        target[prop] = source[prop];
    });
}