import { AcceptanceProbability, EnergyDirection, SimulatedAnnealing, Temperature } from ".";

const getEnergy = (etat: Array<number>): number => {
	// Fonction de coût: La différence absolue entre les éléments voisins du tableau.
	return etat.reduce((previous: number, current: number, index: number): number => {
		if (index === 0) return previous;

		return previous + Math.abs(current - etat[index - 1]);
	}, 0);
};

const getNeighbor = (etat: Array<number>): Array<number> => {
	// Intervertis 2 valeurs.
	// On peut aussi intervertir 2 valeurs voisines.
	const index1 = Math.randomInt(0, etat.length - 1);
	const index2 = Math.randomInt(0, etat.length - 1);

	return etat.swap(index1, index2);
};

const initialState: Array<number> = [1, 9, 8, 5, 2, 3, 7, 6, 1, 9];
SimulatedAnnealing.run<Array<number>>(initialState, getEnergy, getNeighbor, {
	maxSteps: 100,
	getTemperature: Temperature.linear,
	getAcceptanceProbability: AcceptanceProbability.exp,
	energyDirection: EnergyDirection.minimize,
	energyLimit: 8,
});

console.log("Coût minimum :", getEnergy(initialState.sort()));
