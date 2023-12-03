/** Toutes les fonctions de calcul de température. Chaque fonction retourne une valeur compris entre 0 et 1. */
export abstract class Temperature {
	public static linear(currentStep: number, maxSteps: number): number {
		return currentStep / maxSteps;
	}
}
