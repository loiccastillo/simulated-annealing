export {};

declare global {
	interface Math {
		randomInt(min: number, max: number): number;
	}
}

/** Retourne un nombre aléatoire entre `min` et `max` inclus.
 * @returns Un nombre aléatoire entre `min` et `max` inclus.
 */
Math.randomInt = function (min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
