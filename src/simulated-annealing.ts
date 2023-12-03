import { AcceptanceProbability } from "./acceptance-probability";
import "./array-extension";
import "./math-extension";
import { Temperature } from "./temperature";
import { Direction, EnergyDirection } from "./energy-direction";

type acceptance = (currentCost: number, bestCost: number, temperature: number) => number;

/** Configuration utilisateur pour réaliser  */
export interface SimulatedAnnealingConfig {
	maxSteps?: number;
	energyLimit?: number;
	energyDirection?: Direction;
	getTemperature?: (currentStep: number, maxSteps: number) => number;
	getAcceptanceProbability?: acceptance;
}

interface FilledConfig extends Required<SimulatedAnnealingConfig> {}

export abstract class SimulatedAnnealing {
	public constructor() {}

	public static run<T>(
		initialState: T,
		/** Fonction objectif. Calcul l'énergie d'un état. */
		getCost: (state: T) => number,
		smallMutation: (state: T) => T,
		userConfig?: SimulatedAnnealingConfig
	): void {
		const config = this.fillConfigDefaultValues(userConfig);

		let state = initialState;
		let bestState = initialState;
		let energy = getCost(initialState);
		let bestEnergy = getCost(bestState);
		let step = 0;

		console.log("Starting with initial state (", getCost(initialState), ") :", initialState);

		while (!this.hasToStop(step, config.maxSteps, energy, config.energyLimit, config.energyDirection)) {
			const stateX: T = smallMutation(state);
			const energyX: number = getCost(stateX);
			const temperature = config.getTemperature(step, config.maxSteps);
			const accepted = this.isAccepted(energyX, energy, temperature, config.getAcceptanceProbability, config.energyDirection);
			console.log(`Itération ${step + 1}: ${accepted}. Coût: ${energyX}, température: ${temperature}, solution: ${stateX}`);

			if (accepted) {
				state = stateX;
				energy = energyX;
			}

			if (config.energyDirection.isStrictlyBetter(energy, bestEnergy)) {
				bestState = stateX;
				bestEnergy = energyX;
			}

			step++;
		}

		console.log("Ending with best cost:", getCost(bestState), ", best solution:", bestState);
	}

	private static hasToStop(
		currentStep: number,
		maxSteps: number,
		currentEnergy: number,
		limitEnergy: number,
		energyDirection: Direction
	): boolean {
		if (currentStep >= maxSteps) return true;

		// On arrête si l'énergie a atteint la valeur extremum.
		return energyDirection.isBetter(currentEnergy, limitEnergy);
	}

	private static isAccepted(
		newEnergy: number,
		oldEnergy: number,
		temperature: number,
		acceptanceFct: acceptance,
		direction: Direction
	): boolean {
		// On accepte toujours une meilleure valeur.
		if (direction.isStrictlyBetter(newEnergy, oldEnergy)) return true;

		const acceptanceProbability = acceptanceFct(newEnergy, oldEnergy, temperature);
		console.log(`prob: ${(acceptanceProbability * 100).toFixed(4)}%`);

		return Math.random() < acceptanceProbability;
	}

	private static fillConfigDefaultValues(userConfig?: SimulatedAnnealingConfig): FilledConfig {
		userConfig = userConfig ?? {};
		const configDirection = userConfig.energyDirection ?? EnergyDirection.minimize;

		const newConfig: FilledConfig = {
			maxSteps: userConfig.maxSteps ?? 100,
			energyDirection: configDirection,
			energyLimit: userConfig.energyLimit ?? configDirection.defaultExtremeValue(),
			getTemperature: userConfig.getTemperature ?? Temperature.linear,
			getAcceptanceProbability: userConfig.getAcceptanceProbability ?? AcceptanceProbability.exp,
		};

		return newConfig;
	}
}