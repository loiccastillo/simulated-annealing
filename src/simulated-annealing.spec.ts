import { beforeEach, describe, expect, it, test } from "@jest/globals";
import { EnergyDirection } from "./energy-direction";
import { AcceptanceProbability, SimulatedAnnealing } from "./simulated-annealing";

describe("Simulated SimulatedAnnealingling", () => {
	beforeEach(() => {});

	describe("hasToStop", () => {
		it("doit continuer si première étape", () => {
			expect(SimulatedAnnealing["hasToStop"](0, 100, 100, 0, EnergyDirection.minimize)).toBe(false);
		});

		it("doit s'arrêter à la dernière étape", () => {
			expect(SimulatedAnnealing["hasToStop"](100, 100, 100, 0, EnergyDirection.minimize)).toBe(true);
		});

		it("doit s'arrêter à l'énergie min", () => {
			expect(SimulatedAnnealing["hasToStop"](0, 100, 0, 0, EnergyDirection.minimize)).toBe(true);
		});

		it("doit s'arrêter à l'énergie max", () => {
			expect(SimulatedAnnealing["hasToStop"](0, 100, 100, 100, EnergyDirection.maximize)).toBe(true);
		});

		it("doit continuer", () => {
			expect(SimulatedAnnealing["hasToStop"](50, 100, 5.5, 0, EnergyDirection.minimize)).toBe(false);
			expect(SimulatedAnnealing["hasToStop"](1, 2, 99.99, 100, EnergyDirection.maximize)).toBe(false);
		});
	});

	describe("isAccepted", () => {
		it("accepte toujours une meilleure valeur (minimisation)", () => {
			expect(SimulatedAnnealing["isAccepted"](1.9, 2, 0.5, AcceptanceProbability.random, EnergyDirection.minimize)).toBe(true);
			expect(SimulatedAnnealing["isAccepted"](99.99999, 1000, 0.5, AcceptanceProbability.ifBetter, EnergyDirection.minimize)).toBe(true);
			expect(SimulatedAnnealing["isAccepted"](-150, 0, 0.5, AcceptanceProbability.ifBetter, EnergyDirection.minimize)).toBe(true);
		});

		it("accepte toujours une meilleure valeur (maximisation)", () => {
			expect(SimulatedAnnealing["isAccepted"](2, 1.9, 0.5, AcceptanceProbability.random, EnergyDirection.maximize)).toBe(true);
			expect(SimulatedAnnealing["isAccepted"](100, 99.99999, 0.5, AcceptanceProbability.random, EnergyDirection.maximize)).toBe(true);
			expect(SimulatedAnnealing["isAccepted"](100000, 2, 0.5, AcceptanceProbability.random, EnergyDirection.maximize)).toBe(true);
		});
	});
});
