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

Ouvrir `main.ts`, appeler la méthode run de `SimulatedAnnealing` avec les paramètres appropriés.

Ci-dessous un exemple de configuration où l'on cherche à minimiser la somme entre 2 valeurs voisines d'un tableau.
La fonction de coût `getCost` retourne `15` pour `[1,9,2]`. Les versions minimales sont: `[1,2,9]` et `[9,2,1]` qui ont un coût de `8`.

```typescript
import { SimulatedAnnealing } from "./modules/simulated-annealing/simulated-annealing";

const getEnergy = (etat: Array<number>): number => {
	// Exemple de fonction de coût: La différence absolue entre les éléments voisins du tableau.
	return etat.reduce((previous: number, current: number, index: number): number => {
		if (index === 0) return previous;

		return previous + Math.abs(current - etat[index - 1]);
	}, 0);
};

const getNeighbor = (etat: Array<number>): Array<number> => {
	// Intervertis 2 éléments du tableau.
	return etat.swap(Math.randomInt(0, etat.length - 1), Math.randomInt(0, etat.length - 1));
};

SimulatedAnnealing.run<Array<number>>([1, 9, 2], getEnergy, getNeighbor);
```

### Paramètres

1. Valeur initiale.
2. Fonction de calcul de l'énergie. En dehors du recuit, cette méthode est appelée fonction objective. En prend un état et retourne son énergie/son coût.
3. Fonction de mutation de l'état. Prend en paramètre un état et retourne un nouvel état.
4. Il est possible de paramétrer le nombre maximal d'itérations, la valeur extremum de l'énergie, la fonction de calcul de la température, la fonction de calcul de la probabilité d'accepter une valeur. Il est aussi possible de **maximiser** plutôt que minimiser l'énergie. Aucun paramètre de la configuration n'est obligatoire.
   Exemple:

```typescript
SimulatedAnnealing.run<Array<number>>(initialState, getCost, getNeighbor, {
	maxSteps: 100,
	getTemperature: Temperature.linear,
	getAcceptanceProbability: AcceptanceProbability.exp,
	energyDirection: EnergyDirection.maximize,
	energyLimit: 8,
});
```

Il n'est pas nécessaire de manipuler un tableau de nombres. Il est possible de manipuler nimporte **quel type de données**.

Différents algorithmes de calcul de l'énergie et de l'acceptation d'un nouvel état sont implémentés. Il est possible de créer son propre algorithme.

```typescript
	getTemperature: (currentStep: number, maxSteps: number): number => currentStep / maxSteps,
	getAcceptanceProbability: (currentCost: number, lastAcceptedCost: number, temperature: number): number => temperature,
```

## 3. Exécuter

```
npm run run
```
