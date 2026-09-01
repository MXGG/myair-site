import { execFileSync } from 'node:child_process';

const bucketName = 'myair-guestbook-images';

function runWrangler(argumentsList) {
	return execFileSync('npx', ['wrangler', ...argumentsList], {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	});
}

try {
	runWrangler(['r2', 'bucket', 'info', bucketName, '--json']);
	console.log(`R2 bucket is already available: ${bucketName}.`);
} catch (lookupError) {
	try {
		console.log(`Creating private R2 bucket ${bucketName} in the Asia-Pacific region.`);
		runWrangler(['r2', 'bucket', 'create', bucketName, '--location', 'apac']);
		console.log(`Created private R2 bucket ${bucketName}.`);
	} catch (createError) {
		const lookupDetails = `${lookupError?.stdout ?? ''}\n${lookupError?.stderr ?? ''}`.trim();
		const createDetails = `${createError?.stdout ?? ''}\n${createError?.stderr ?? ''}`.trim();
		throw new Error([
			`Unable to locate or create the R2 bucket ${bucketName}.`,
			lookupDetails,
			createDetails,
		].filter(Boolean).join('\n'));
	}
}
