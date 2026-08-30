'use client';

import { CheckCircle2, Circle, Trash2 } from 'lucide-react';

interface Item {
    id: number;
    nome: string;
    valor: number;
    categoria: string;
    concluido: boolean;
}

interface ItemCardProps {
    item: Item;
    onAlternar: (id: number) => void;
    onRemover: (id: number) => void;
}

export function ItemCard({ item, onAlternar, onRemover }: ItemCardProps) {
    return (
        <li className="flex justify-between items-center p-3.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-xl transition">
            <div
                onClick={() => onAlternar(item.id)}
                className="flex items-center gap-3 cursor-pointer select-none"
            >
                {item.concluido ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                    <Circle className="w-5 h-5 text-slate-500 shrink-0 hover:text-indigo-400" />
                )}
                <div>
                    <span
                        className={`block font-medium text-sm ${item.concluido ? 'line-through text-slate-500' : 'text-slate-200'
                            }`}
                    >
                        {item.nome}
                    </span>
                    <span className="text-[11px] text-slate-400">
                        {item.categoria} {item.valor > 0 && `• R$ ${item.valor.toFixed(2)}`}
                    </span>
                </div>
            </div>
            <button
                onClick={() => onRemover(item.id)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </li>
    );
}