import type { CostItem, LotInput, LotMetrics } from './types';

const safe = (value: number) => Number.isFinite(value) && value > 0 ? value : 0;
export function expandCost(item: CostItem, animals: number, days: number, revenue = 0): number {
  const value = safe(item.value);
  if (item.basis === 'animal') return value * animals;
  if (item.basis === 'dia') return value * days;
  if (item.basis === 'receita_pct') return safe(revenue) * value / 100;
  return value;
}

/** Arroba equivalente produzida em peso vivo: 30 kg de ganho de PV = 1 @ equivalente.
 * Mantida separada da arroba de carcaça (15 kg), que depende do rendimento informado. */
export const liveWeightArrobas = (weightGainKg: number) => safe(weightGainKg) / 30;

export function calculateLot(raw: LotInput): LotMetrics {
  const animals = safe(raw.animals), days = safe(raw.days);
  const entry = safe(raw.entryWeight), current = safe(raw.currentWeight);
  const gain = Math.max(0, current - entry);
  const dailyGain = days ? gain / days : 0;
  const feedPerHeadDay = safe(raw.intake) * safe(raw.dietCost);
  const feedPerAnimal = feedPerHeadDay * days;
  const feedTotal = feedPerAnimal * animals;
  const saleQuantityPerAnimal = raw.saleUnit === 'kg' ? carcassWeightPerAnimal : carcassArrobasPerAnimal;
  const revenue = saleQuantityPerAnimal * animals * safe(raw.salePrice);
  const otherCostsTotal = raw.otherCosts.reduce((sum, cost) => sum + expandCost(cost, animals, days, revenue), 0);
  const salesCommissionTotal = raw.otherCosts.filter(cost => cost.basis === 'receita_pct').reduce((sum, cost) => sum + expandCost(cost, animals, days, revenue), 0);
  // Compra é capital de aquisição e, deliberadamente, não compõe o custo da @ produzida.
  const productionCosts = feedTotal + otherCostsTotal;
  const purchasePerAnimal = raw.purchaseUnit === 'arroba'
    ? (safe(raw.purchaseWeight) / 30) * safe(raw.purchasePrice)
    : safe(raw.purchaseWeight) * safe(raw.purchasePrice);
  const purchaseTotal = purchasePerAnimal * animals;
  const producedPerAnimal = liveWeightArrobas(gain);
  const producedTotal = producedPerAnimal * animals;
  const investment = purchaseTotal + productionCosts;
  const carcassWeightPerAnimal = current * safe(raw.carcassYield) / 100;
  const carcassArrobasPerAnimal = carcassWeightPerAnimal / 15;
  const carcassArrobasTotal = carcassArrobasPerAnimal * animals;
  const saleArrobasPerAnimal = carcassArrobasPerAnimal;
  const result = revenue - investment;
  const maxPurchaseTotal = Math.max(0, revenue - productionCosts);
  const maxPurchasePerAnimal = animals ? maxPurchaseTotal / animals : 0;
  const maxPurchasePriceKg = safe(raw.purchaseWeight) ? maxPurchasePerAnimal / safe(raw.purchaseWeight) : 0;
  const maxPurchasePriceArroba = safe(raw.purchaseWeight) ? maxPurchasePerAnimal / (safe(raw.purchaseWeight) / 30) : 0;
  return {
    dailyGain, weightGain: gain, feedPerHeadDay, feedPerAnimal, feedTotal, otherCostsTotal, salesCommissionTotal,
    productionCosts, operationalPerAnimal: animals ? productionCosts / animals : 0,
    totalCost: investment, liveArrobasProducedPerAnimal: producedPerAnimal,
    liveArrobasProducedTotal: producedTotal, producedArrobaCost: producedTotal ? productionCosts / producedTotal : 0,
    costPerHeadDay: animals && days ? productionCosts / animals / days : 0,
    carcassWeightPerAnimal, carcassArrobasPerAnimal, carcassArrobasTotal,
    purchasePerAnimal, purchaseTotal, investment, saleArrobasPerAnimal, revenue, result,
    marginPerAnimal: animals ? result / animals : 0, roi: investment ? result / investment * 100 : 0,
    breakEven: saleArrobasPerAnimal && animals ? investment / (saleArrobasPerAnimal * animals) : 0,
    maxPurchaseTotal, maxPurchasePerAnimal, maxPurchasePriceKg, maxPurchasePriceArroba,
  };
}
