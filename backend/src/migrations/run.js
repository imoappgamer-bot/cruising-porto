/**
 * Runner de migrations Sequelize.
 * Uso: node src/migrations/run.js
 * Carrega e executa as migrations por ordem alfabética do nome do ficheiro.
 */
import sequelize from '../config/database.js';
import { readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const queryInterface = sequelize.getQueryInterface();
  const Sequelize = sequelize.constructor;

  // Criar tabela de controlo de migrations se não existir
  await queryInterface.createTable('SequelizeMeta', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
  }).catch(() => {}); // ignora se já existe

  // Buscar migrations já executadas
  const [executed] = await sequelize.query(
    'SELECT name FROM "SequelizeMeta" ORDER BY name'
  );
  const executedNames = new Set(executed.map((r) => r.name));

  // Listar ficheiros de migration (exclui o próprio run.js)
  const files = readdirSync(__dirname)
    .filter((f) => f.endsWith('.js') && f !== 'run.js')
    .sort();

  for (const file of files) {
    if (executedNames.has(file)) {
      console.log(`[skip]  ${file}`);
      continue;
    }

    const migration = await import(pathToFileURL(resolve(__dirname, file)).href);
    console.log(`[run]   ${file}`);
    await migration.up(queryInterface, Sequelize);
    await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES (?)', {
      replacements: [file],
      type: Sequelize.QueryTypes.INSERT,
    });
    console.log(`[done]  ${file}`);
  }

  console.log('Migrations concluídas.');
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Erro nas migrations:', err);
  process.exit(1);
});
