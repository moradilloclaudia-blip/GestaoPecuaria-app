import { describe, expect, it } from 'vitest';
import { calculateLot, expandCost, liveWeightArrobas } from './calculations';
import type { LotInput } from './types';

const lot: LotInput = { name:'Teste', animals:100, entryWeight:360, currentWeight:510, days:100, carcassYield:55, purchaseWeight:360, purchasePrice:12, purchaseUnit:'kg', intake:10, dietCost:1.5, salePrice:300, saleUnit:'arroba', otherCosts:[{id:'1',name:'Sanidade',value:20,basis:'animal'},{id:'2',name:'Frete',value:1000,basis:'lote'}] };
describe('cálculos do lote', () => {
  it('calcula indicadores técnicos', () => { const m=calculateLot(lot); expect(m.dailyGain).toBe(1.5); expect(m.feedPerAnimal).toBe(1500); expect(m.liveArrobasProducedTotal).toBe(500); expect(m.carcassArrobasPerAnimal).toBe(18.7); expect(m.carcassArrobasTotal).toBe(1870); });
  it('não inclui compra no custo da arroba produzida', () => { const m=calculateLot(lot); expect(m.productionCosts).toBe(153000); expect(m.producedArrobaCost).toBe(306); expect(m.investment).toBe(585000); });
  it('calcula receita pelo peso de carcaça e resultado', () => { const m=calculateLot(lot); expect(m.revenue).toBe(561000); expect(m.result).toBe(-24000); expect(m.breakEven).toBeCloseTo(312.834,2); expect(m.maxPurchasePriceKg).toBeCloseTo(11.3333,3); });
  it('aceita venda por kg de carcaça', () => { const m=calculateLot({...lot,saleUnit:'kg',salePrice:20}); expect(m.revenue).toBe(561000); });
  it('aceita compra por arroba equivalente de peso vivo', () => { const m=calculateLot({...lot,purchaseUnit:'arroba',purchasePrice:360}); expect(m.purchasePerAnimal).toBe(4320); });
  it('calcula comissão percentual sobre a receita', () => { const m=calculateLot({...lot,otherCosts:[...lot.otherCosts,{id:'3',name:'Comissão de venda',value:1,basis:'receita_pct'}]}); expect(m.salesCommissionTotal).toBe(5610); expect(m.productionCosts).toBe(158610); });
  it('trata divisões por zero', () => { const m=calculateLot({...lot,animals:0,days:0,currentWeight:0}); expect(m.dailyGain).toBe(0); expect(m.roi).toBe(0); expect(m.producedArrobaCost).toBe(0); });
  it('expande bases de custo', () => { expect(expandCost({id:'x',name:'x',value:5,basis:'animal'},10,20)).toBe(50); expect(liveWeightArrobas(150)).toBe(5); });
});
