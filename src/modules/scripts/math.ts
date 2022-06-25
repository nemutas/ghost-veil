export const lerp = (current: number, target: number, a: number) => {
	return current * (1 - a) + target * a
}
