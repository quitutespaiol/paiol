// Full-business backup import. The catalogue exchange format is intentionally separate:
// migration to a new origin needs clients, orders, settlements and settings too.

import { fromYaml } from './yaml-bridge.js';
import { PaiolStore, SCHEMA_VERSION } from './store.js';

const REQUIRED_COLLECTIONS = [
  'ingredients', 'recipes', 'products', 'clients', 'encomendas', 'comandas',
  'sales', 'payments', 'despesas', 'financeTitles', 'financeSettlements',
];

/** Parse a complete Paiol export, rejecting catalogue-only and future-schema files. */
export function parseFullBackup(text) {
  const data = fromYaml(text);
  if (!data || typeof data !== 'object' || Array.isArray(data)
    || !Number.isInteger(data.version) || data.version < 1
    || !data.config || typeof data.config !== 'object' || Array.isArray(data.config)
    || REQUIRED_COLLECTIONS.some((key) => !Array.isArray(data[key]))) {
    throw new Error('Este arquivo não é um backup completo do Paiol. Use o arquivo gerado em “Criar backup extra agora”.');
  }
  if (data.version > SCHEMA_VERSION) {
    throw new Error('O backup foi criado por uma versão mais nova do Paiol. Atualize o sistema antes de importar.');
  }
  return new PaiolStore(data);
}

/** Small, non-sensitive preview before replacing the local store. */
export function fullBackupSummary(backup) {
  const s = backup.state;
  return {
    clientes: s.clients.length,
    insumos: s.ingredients.length,
    receitas: s.recipes.length,
    produtos: s.products.length,
    encomendas: s.encomendas.length,
    vendas: s.sales.length,
    contas: s.financeTitles.length,
  };
}
