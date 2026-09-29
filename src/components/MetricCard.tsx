import type { LucideIcon } from 'lucide-react';
export function MetricCard({ label, value, icon: Icon, featured=false, tone='default' }:{label:string;value:string;icon:LucideIcon;featured?:boolean;tone?:'default'|'positive'|'negative'}) {
  return <article className={`metric ${featured?'featured':''} ${tone}`}><div className="metric-head"><span>{label}</span><i><Icon size={18}/></i></div><strong>{value}</strong></article>;
}
