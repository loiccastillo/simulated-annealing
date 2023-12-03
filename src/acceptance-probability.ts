/** Toutes les fonctions de calcul du taux d'acceptation d'un nouvel état. Chaque fonction retourne une valeur compris entre 0 et 1. */
export abstract class AcceptanceProbability {
	public static linear(currentCost: number, lastAcceptedCost: number, temperature: number): number {
		return temperature;
	}

	public static random(): number {
		return Math.random();
	}

	public static exp(currentCost: number, lastAcceptedCost: number, temperature: number): number {
		const isTemperatureInvalid = isNaN(temperature) || temperature === 0;

		// Si la température n'est pas valide, on n'accepte jamais la solution.
		if (isTemperatureInvalid) return 0;

		return Math.exp(1 / (temperature - 1));
	}

	/** ! N'utiliser cette fonction que pour des tests. La solution va s'enfermer dans un minimum local ! */
	public static ifBetter(currentCost: number, lastAcceptedCost: number, temperature: number): number {
		return currentCost < lastAcceptedCost ? 1 : 0;
	}
}
