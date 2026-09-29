export type PricingUnit = 'kg' | 'arroba';
export type CostBasis = 'animal' | 'dia' | 'lote' | 'receita_pct';
export type LotExit = { id: string; type: 'morte' | 'outra'; quantity: number; day: number };
export type CostItem = { id: string; name: string; value: number; basis: CostBasis };
export type LotInput = {
  name: string; animals: number; deaths?: number; otherExits?: number; exits?: LotExit[]; entryWeight: number; currentWeight: number; days: number;
  carcassYield: number; purchaseWeight: number; purchasePrice: number; purchaseUnit: PricingUnit;
  intake: number; dietCost: number; salePrice: number; saleUnit: PricingUnit; otherCosts: CostItem[];
};
export type LotMetrics = {
  dailyGain: number; weightGain: number; feedPerHeadDay: number; feedPerAnimal: number; feedTotal: number; animalDays: number;
  otherCostsTotal: number; salesCommissionTotal: number; productionCosts: number; operationalPerAnimal: number; totalCost: number;
  liveArrobasProducedPerAnimal: number; liveArrobasProducedTotal: number; producedArrobaCost: number;
  carcassWeightPerAnimal: number; carcassArrobasPerAnimal: number; carcassArrobasTotal: number;
  costPerHeadDay: number; purchasePerAnimal: number; purchaseTotal: number; investment: number;
  saleArrobasPerAnimal: number; revenue: number; result: number; marginPerAnimal: number; roi: number; breakEven: number;
  maxPurchaseTotal: number; maxPurchasePerAnimal: number; maxPurchasePriceKg: number; maxPurchasePriceArroba: number;
};
