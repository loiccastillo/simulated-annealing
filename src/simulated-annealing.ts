import { AcceptanceProbability } from "./acceptance-probability";
import "./array-extension";
import "./math-extension";
import { Temperature } from "./temperature";
import { Direction, EnergyDirection } from "./energy-direction";

type acceptance = (currentEnergy: number, bestEnergy: number, temperature: number) => number;

/** Configuration utilisateur pour réaliser  */
export interface SimulatedAnnealingConfig {
	maxSteps?: number;
	energyLimit?: number;
	energyDirection?: Direction;
	getTemperature?: (currentStep: number, maxSteps: number) => number;
	getAcceptanceProbability?: acceptance;
	enableLog?: boolean;
}

interface FilledConfig extends Required<SimulatedAnnealingConfig> {}

export abstract class SimulatedAnnealing {
	public constructor() {}

	public static run<T>(
		initialState: T,
		/** Objective function. Calculates the energy of a state. */
		getEnergy: (state: T) => number,
		smallMutation: (state: T) => T,
		userConfig?: SimulatedAnnealingConfig
	): T {
		const config = this.fillConfigDefaultValues(userConfig);

		let state = initialState;
		let bestState = initialState;
		let energy = getEnergy(initialState);
		let bestEnergy = getEnergy(bestState);
		let step = 0;

		if (config.enableLog) console.log("Starting with initial state (", getEnergy(initialState), ") :", initialState);

		while (!this.hasToStop(step, config.maxSteps, energy, config.energyLimit, config.energyDirection)) {
			const stateX: T = smallMutation(state);
			const energyX: number = getEnergy(stateX);
			const temperature = config.getTemperature(step, config.maxSteps);
			const accepted = this.isAccepted(energyX, energy, temperature, config.getAcceptanceProbability, config.energyDirection);

			if (config.enableLog)
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

		if (config.enableLog) console.log("Ending with best energy:", getEnergy(bestState), ", best solution:", bestState);

		return bestState;
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
			enableLog: userConfig.enableLog ?? false,
		};

		return newConfig;
	}
}
