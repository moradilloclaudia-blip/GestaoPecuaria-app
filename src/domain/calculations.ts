import type { CostItem, LotInput, LotMetrics } from './types';

const safe = (value: number) => Number.isFinite(value) && value > 0 ? value : 0;
export function expandCost(item: CostItem, animals: number, days: number): number {
  const value = safe(item.value);
  if (item.basis === 'animal') return value * animals;
  if (item.basis === 'dia') return value * days;
  return value;
}

/** Regra MVP: arrobas produzidas medem ganho de peso VIVO (15 kg/@).
 * Este cálculo fica isolado para futura troca por arroba de carcaça. */
export const liveWeightArrobas = (weightGainKg: number) => safe(weightGainKg) / 15;

export function calculateLot(raw: LotInput): LotMetrics {
  const animals = safe(raw.animals), days = safe(raw.days);
  const entry = safe(raw.entryWeight), current = safe(raw.currentWeight);
  const gain = Math.max(0, current - entry);
  const dailyGain = days ? gain / days : 0;
  const feedPerHeadDay = safe(raw.intake) * safe(raw.dietCost);
  const feedPerAnimal = feedPerHeadDay * days;
  const feedTotal = feedPerAnimal * animals;
  const otherCostsTotal = raw.otherCosts.reduce((sum, cost) => sum + expandCost(cost, animals, days), 0);
  // Compra é capital de aquisição e, deliberadamente, não compõe o custo da @ produzida.
  const productionCosts = feedTotal + otherCostsTotal;
  const purchasePerAnimal = raw.purchaseUnit === 'arroba'
    ? (safe(raw.purchaseWeight) / 15) * safe(raw.purchasePrice)
    : safe(raw.purchaseWeight) * safe(raw.purchasePrice);
  const purchaseTotal = purchasePerAnimal * animals;
  const producedPerAnimal = liveWeightArrobas(gain);
  const producedTotal = producedPerAnimal * animals;
  const investment = purchaseTotal + productionCosts;
  const saleArrobasPerAnimal = (current * safe(raw.carcassYield) / 100) / 15;
  const revenue = saleArrobasPerAnimal * animals * safe(raw.salePrice);
  const result = revenue - investment;
  return {
    dailyGain, weightGain: gain, feedPerHeadDay, feedPerAnimal, feedTotal, otherCostsTotal,
    productionCosts, operationalPerAnimal: animals ? productionCosts / animals : 0,
    totalCost: investment, liveArrobasProducedPerAnimal: producedPerAnimal,
    liveArrobasProducedTotal: producedTotal, producedArrobaCost: producedTotal ? productionCosts / producedTotal : 0,
    costPerHeadDay: animals && days ? productionCosts / animals / days : 0,
    purchasePerAnimal, purchaseTotal, investment, saleArrobasPerAnimal, revenue, result,
    marginPerAnimal: animals ? result / animals : 0, roi: investment ? result / investment * 100 : 0,
    breakEven: saleArrobasPerAnimal && animals ? investment / (saleArrobasPerAnimal * animals) : 0,
  };
}
