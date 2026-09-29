import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; suffix?: string; hint?: string };
export function Field({ label, suffix, hint, ...props }: Props) {
  return <label className="field"><span>{label}</span><div className="input-wrap"><input {...props}/>{suffix && <small>{suffix}</small>}</div>{hint && <em>{hint}</em>}</label>;
}
export function SelectField({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & {label:string; children:ReactNode}) {
  return <label className="field"><span>{label}</span><div className="input-wrap"><select {...props}>{children}</select></div></label>;
}
