export {};

declare global {
	interface Array<T> {
		swap(index1: number, index2: number): Array<T>;
	}
}

Array.prototype.swap = function <T>(index1: number, index2: number): Array<T> {
	// TODO On peut optimiser en modifiant le tableau actuel plutôt que d'en créer un autre.
	const newArray = [...this];
	const tmp = newArray[index1];
	newArray[index1] = newArray[index2];
	newArray[index2] = tmp;

	return newArray;
};
