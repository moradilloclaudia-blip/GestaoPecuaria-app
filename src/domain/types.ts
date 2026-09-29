export type PricingUnit = 'kg' | 'arroba';
export type CostBasis = 'animal' | 'dia' | 'lote';
export type CostItem = { id: string; name: string; value: number; basis: CostBasis };
export type LotInput = {
  name: string; animals: number; entryWeight: number; currentWeight: number; days: number;
  carcassYield: number; purchaseWeight: number; purchasePrice: number; purchaseUnit: PricingUnit;
  intake: number; dietCost: number; salePrice: number; otherCosts: CostItem[];
};
export type LotMetrics = {
  dailyGain: number; weightGain: number; feedPerHeadDay: number; feedPerAnimal: number; feedTotal: number;
  otherCostsTotal: number; productionCosts: number; operationalPerAnimal: number; totalCost: number;
  liveArrobasProducedPerAnimal: number; liveArrobasProducedTotal: number; producedArrobaCost: number;
  costPerHeadDay: number; purchasePerAnimal: number; purchaseTotal: number; investment: number;
  saleArrobasPerAnimal: number; revenue: number; result: number; marginPerAnimal: number; roi: number; breakEven: number;
};
