'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Tag, DollarSign, Filter, CheckCheck } from 'lucide-react';
import { ItemCard } from './components/ItemCard';

interface Item {
  id: number;
  nome: string;
  valor: number;
  categoria: string;
  concluido: boolean;
}

export default function Home() {
  const [itens, setItens] = useState<Item[]>([]);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Mercado');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('todos'); // 'todos' | 'pendentes' | 'concluidos'

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('lista_compras');
    if (dadosSalvos) {
      setItens(JSON.parse(dadosSalvos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lista_compras', JSON.stringify(itens));
  }, [itens]);

  const adicionarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const novoItem: Item = {
      id: Date.now(),
      nome,
      valor: valor ? parseFloat(valor) : 0,
      categoria,
      concluido: false,
    };

    setItens([...itens, novoItem]);
    setNome('');
    setValor('');
  };

  const alternarConcluido = (id: number) => {
    setItens(
      itens.map((item) =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      )
    );
  };

  const removerItem = (id: number) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const limparConcluidos = () => {
    setItens(itens.filter((item) => !item.concluido));
  };

  // Filtragem dos itens em tempo de renderização
  const itensFiltrados = itens.filter((item) => {
    const bateCategoria = filtroCategoria === 'Todas' || item.categoria === filtroCategoria;
    const bateStatus =
      filtroStatus === 'todos' ||
      (filtroStatus === 'pendentes' && !item.concluido) ||
      (filtroStatus === 'concluidos' && item.concluido);

    return bateCategoria && bateStatus;
  });

  const totalGasto = itens.reduce((acc, item) => acc + item.valor, 0);
  const temConcluidos = itens.some((item) => item.concluido);

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 text-slate-100">
      <div className="bg-slate-800 border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Cabeçalho */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-bold text-white">Lista de Compras</h1>
            </div>
            <p className="text-xs text-slate-400">
              Total gasto: <strong className="text-emerald-400 font-semibold text-sm">R$ {totalGasto.toFixed(2)}</strong>
            </p>
          </div>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium px-3 py-1 rounded-full">
            {itens.length} {itens.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {/* Formulário */}
        <form onSubmit={adicionarItem} className="flex flex-col gap-3 mb-6">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do item (ex: Leite)"
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 text-sm"
          />

          <div className="flex gap-2">
            <div className="relative w-1/2">
              <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0.00 (opcional)"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 text-sm"
              />
            </div>
            <div className="relative w-1/2">
              <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 text-sm cursor-pointer"
              >
                <option value="Mercado">Mercado</option>
                <option value="Farmácia">Farmácia</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-medium text-sm transition"
          >
            <Plus className="w-4 h-4" /> Adicionar Item
          </button>
        </form>

        {/* Barra de Filtros e Ações */}
        {itens.length > 0 && (
          <div className="flex flex-col gap-2 mb-4 pt-2 border-t border-slate-700/50">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1 text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Filtrar:</span>
              </div>
              {temConcluidos && (
                <button
                  onClick={limparConcluidos}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Limpar marcados
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-1/2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Todas">Todas as Categorias</option>
                <option value="Mercado">Mercado</option>
                <option value="Farmácia">Farmácia</option>
                <option value="Outros">Outros</option>
              </select>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-1/2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="todos">Todos os Status</option>
                <option value="pendentes">Apenas Pendentes</option>
                <option value="concluidos">Apenas Marcados</option>
              </select>
            </div>
          </div>
        )}

        {/* Lista de Itens Filtrados */}
        <ul className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {itensFiltrados.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onAlternar={alternarConcluido}
              onRemover={removerItem}
            />
          ))}
        </ul>

        {itensFiltrados.length === 0 && (
          <p className="text-center text-slate-500 text-xs mt-6">
            Nenhum item encontrado com esses filtros.
          </p>
        )}
      </div>
    </main>
  );
}