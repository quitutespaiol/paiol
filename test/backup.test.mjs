import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFullBackup, fullBackupSummary } from '../src/backup.js';
import { PaiolStore } from '../src/store.js';
import { toYaml } from '../src/yaml-bridge.js';

test('complete backup restores the whole business without keeping seeded categories', () => {
  const source = new PaiolStore();
  source.state.clients.push({ id: 'client-1', name: 'Cliente Teste' });
  source.state.categories.push({ id: 'category-1', name: 'Categoria Teste', kind: 'receita' });
  source.state.encomendas.push({ id: 'order-1', clientId: 'client-1', items: [] });
  const backup = parseFullBackup(source.toYaml());
  assert.equal(fullBackupSummary(backup).clientes, 1);
  assert.equal(fullBackupSummary(backup).encomendas, 1);

  const target = new PaiolStore();
  target.state.categories.push({ id: 'seed-1', name: 'Padrão', kind: 'receita' });
  target.replaceWith(backup);
  assert.deepEqual(target.state.categories.map((c) => c.id), ['category-1']);
  assert.equal(target.get('clients', 'client-1')?.name, 'Cliente Teste');
  assert.equal(target.state.encomendas.length, 1);
});

test('catalogue and future-schema files cannot replace the full business', () => {
  assert.throws(() => parseFullBackup(toYaml({ ingredients: [], recipes: [], products: [] })), /backup completo/);
  const future = new PaiolStore();
  future.state.version = 999;
  assert.throws(() => parseFullBackup(future.toYaml()), /versão mais nova/);
});
