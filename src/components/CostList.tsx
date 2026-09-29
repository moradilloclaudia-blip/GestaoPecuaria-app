import { Plus, Trash2 } from 'lucide-react';
import type { CostItem } from '../domain/types';
export function CostList({ costs, onChange }:{costs:CostItem[];onChange:(c:CostItem[])=>void}) {
  const update=(id:string, patch:Partial<CostItem>)=>onChange(costs.map(c=>c.id===id?{...c,...patch}:c));
  return <div className="cost-list">
    <div className="cost-head"><span>Descrição</span><span>Valor</span><span>Aplicação</span><span/></div>
    {costs.map(c=><div className="cost-row" key={c.id}>
      <input aria-label="Descrição do custo" value={c.name} onChange={e=>update(c.id,{name:e.target.value})}/>
      <div className="money"><span>R$</span><input aria-label={`Valor de ${c.name}`} type="number" min="0" step="0.01" value={c.value||''} onChange={e=>update(c.id,{value:Number(e.target.value)})}/></div>
      <select aria-label={`Aplicação de ${c.name}`} value={c.basis} onChange={e=>update(c.id,{basis:e.target.value as CostItem['basis']})}><option value="animal">Por animal</option><option value="dia">Por dia (lote)</option><option value="lote">Total do lote</option><option value="receita_pct">% da receita de venda</option></select>
      <button className="icon-btn danger-btn" aria-label={`Excluir ${c.name}`} onClick={()=>onChange(costs.filter(x=>x.id!==c.id))}><Trash2 size={17}/></button>
    </div>)}
    <button className="add-btn" onClick={()=>onChange([...costs,{id:crypto.randomUUID(),name:'Novo custo',value:0,basis:'animal'}])}><Plus size={17}/> Adicionar custo</button>
  </div>;
}
