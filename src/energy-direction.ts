export interface Direction {
	isStrictlyBetter: (newEnergy: number, oldEnergy: number) => boolean;
	isBetter: (newEnergy: number, limit: number) => boolean;
	defaultExtremeValue: () => number;
}

class EnergyMinimize implements Direction {
	public isStrictlyBetter(newEnergy: number, oldEnergy: number): boolean {
		return newEnergy < oldEnergy;
	}

	public isBetter(newEnergy: number, limit: number): boolean {
		return newEnergy <= limit;
	}

	public defaultExtremeValue(): number {
		return Number.NEGATIVE_INFINITY;
	}
}

class EnergyMaximize implements Direction {
	public isStrictlyBetter(newEnergy: number, oldEnergy: number): boolean {
		return newEnergy > oldEnergy;
	}

	public isBetter(newEnergy: number, limit: number): boolean {
		return newEnergy >= limit;
	}

	public defaultExtremeValue(): number {
		return Number.POSITIVE_INFINITY;
	}
}

export abstract class EnergyDirection {
	public static minimize = new EnergyMinimize();
	public static maximize = new EnergyMaximize();
}
