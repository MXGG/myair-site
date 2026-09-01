import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const databaseName = 'myair-guestbook';
const configPath = new URL('../wrangler.jsonc', import.meta.url);
const placeholderId = '00000000-0000-0000-0000-000000000000';

function runWrangler(argumentsList) {
	return execFileSync('npx', ['wrangler', ...argumentsList], {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'inherit'],
	});
}

function listDatabases() {
	const output = runWrangler(['d1', 'list', '--json']);
	const parsed = JSON.parse(output);
	return Array.isArray(parsed) ? parsed : parsed.result ?? [];
}

function databaseId(database) {
	return database.uuid ?? database.id ?? database.database_id ?? '';
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const binding = config.d1_databases?.find((item) => item.binding === 'DB');
if (!binding) throw new Error('The DB binding is missing from wrangler.jsonc.');

if (binding.database_id && binding.database_id !== placeholderId) {
	console.log(`D1 database is already configured: ${binding.database_name}.`);
	process.exit(0);
}

let database = listDatabases().find((item) => item.name === databaseName);
if (!database) {
	console.log(`Creating D1 database ${databaseName} in the Asia-Pacific region.`);
	runWrangler(['d1', 'create', databaseName, '--location', 'apac']);
	database = listDatabases().find((item) => item.name === databaseName);
}

const id = databaseId(database);
if (!/^[0-9a-f-]{36}$/i.test(id)) {
	throw new Error(`Cloudflare did not return a valid database ID for ${databaseName}.`);
}

binding.database_name = databaseName;
binding.database_id = id;
writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Configured D1 database ${databaseName}.`);
