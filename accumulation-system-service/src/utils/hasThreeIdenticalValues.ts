export function hasThreeIdenticalValues(arr: number[]): boolean {
    if (arr?.length !== 3) return false;
    return arr[0] === arr[1] && arr[1] === arr[2];
}