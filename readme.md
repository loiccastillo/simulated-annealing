# Simulated Annealing in TypeScript

This npm module provides a TypeScript implementation of the Simulated Annealing algorithm, offering flexibility to handle various data types and supporting both maximization and minimization objectives.

## Key features

- **Type Agnostic**: Designed to handle and optimize any type of data, allowing seamless integration with different problem domains.
- **Maximization and Minimization**: Accommodates both maximization and minimization objectives, providing a robust solution for diverse optimization scenarios.
- **Configurable Parameters**: Easily customizable parameters to fine-tune the algorithm according to the specific requirements of your problem.

## Installation

```bash
npm install simulated-annealing-ts
```

## Usage

Create a `main.ts` file, call the `run` method of `SimulatedAnnealing` with the appropriate parameters.

Here's a configuration example where we aim to minimize the sum between two neighboring values in an array. The energy function `getEnergy` returns `15` for `[1,9,2]`. The minimal versions are: `[1,2,9]` and `[9,2,1]` with a energy of `8`.

```typescript
import { SimulatedAnnealing } from "simulated-annealing-ts";

const getEnergy = (etat: Array<number>): number => {
	// Example energy function: The absolute difference between neighboring elements in the array.
	return etat.reduce((previous: number, current: number, index: number): number => {
		if (index === 0) return previous;

		return previous + Math.abs(current - etat[index - 1]);
	}, 0);
};

const randomInt = function (min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/** Swap 2 random elements in the array. */
const swap2Elements = (etat: Array<number>): Array<number> => {
	const index1 = randomInt(0, etat.length - 1);
	const index2 = randomInt(0, etat.length - 1);

	const newArray = [...etat];
	const tmp = newArray[index1];
	newArray[index1] = newArray[index2];
	newArray[index2] = tmp;

	return newArray;
};

const initialState: Array<number> = [1, 9, 2];
const result = SimulatedAnnealing.run<Array<number>>(initialState, getEnergy, swap2Elements);

console.log("Best solution found (", getEnergy(result), "):", result);
```

### Parameters

1. `initialValue`.
2. `getEnergy`: Outside of simulated annealing, this method is called the objective function. Takes a state and returns its energy/cost.
3. `smallMutation`: Takes a state as a parameter and returns a new state.
4. `config`: Il est possible de paramétrer le nombre maximal d'itérations, la valeur extremum de l'énergie, la fonction de calcul de la température, la fonction de calcul de la probabilité d'accepter une valeur. Il est aussi possible de **maximiser** plutôt que minimiser l'énergie. Aucun paramètre de la configuration n'est obligatoire.
   Exemple:

```typescript
const result = SimulatedAnnealing.run<Array<number>>(initialState, getEnergy, swap2Elements, {
	maxSteps: 100,
	getTemperature: Temperature.linear,
	getAcceptanceProbability: AcceptanceProbability.exp,
	energyDirection: EnergyDirection.minimize,
	energyLimit: 8,
});
```

You don't have to manipulate an array of numbers. It's possible to manipulate **any data type**.

Various algorithms for energy calculation and accepting a new state are implemented. You can create your own algorithm.

```typescript
	getTemperature: (currentStep: number, maxSteps: number): number => currentStep / maxSteps,
	getAcceptanceProbability: (currentEnergy: number, lastAcceptedEnergy: number, temperature: number): number => temperature,
```
