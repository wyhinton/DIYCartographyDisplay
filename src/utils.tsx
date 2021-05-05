export function getRandomNumber(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
}