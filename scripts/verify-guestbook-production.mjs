const apiBase = process.env.GUESTBOOK_API_BASE ?? 'https://myair.info/api/guestbook';
const adminToken = process.env.GUESTBOOK_ADMIN_TOKEN;
const marker = `deployment-check-${(process.env.GITHUB_SHA ?? Date.now().toString()).slice(0, 12)}`;

if (!adminToken) throw new Error('GUESTBOOK_ADMIN_TOKEN is required for production verification.');

const adminHeaders = {
	Accept: 'application/json',
	Authorization: `Bearer ${adminToken}`,
};

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(path, options = {}, expectedStatus = 200) {
	let lastError;
	for (let attempt = 1; attempt <= 12; attempt += 1) {
		try {
			const response = await fetch(`${apiBase}${path}`, options);
			if (response.status === expectedStatus) return response;
			lastError = new Error(`${path} returned ${response.status}; expected ${expectedStatus}.`);
		} catch (error) {
			lastError = error;
		}
		if (attempt < 12) await wait(5_000);
	}
	throw lastError;
}

const health = await fetchWithRetry('/health');
const healthData = await health.json();
if (!healthData.ok) throw new Error('Guestbook health check did not return ok.');

await fetchWithRetry('/messages', { method: 'GET' }, 404);
await fetchWithRetry('/admin/messages', { headers: { Accept: 'application/json' } }, 401);

const captchaResponse = await fetchWithRetry('/captcha', { headers: adminHeaders });
const captcha = await captchaResponse.json();
if (!captcha.challengeId || !captcha.answer) {
	throw new Error('Authorized deployment verification did not receive a CAPTCHA challenge.');
}

const submissionResponse = await fetchWithRetry('/messages', {
	method: 'POST',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		Origin: 'https://myair.info',
	},
	body: JSON.stringify({
		name: 'Deployment check',
		contact: '',
		content: marker,
		captchaId: captcha.challengeId,
		captchaAnswer: captcha.answer,
		website: '',
	}),
}, 201);
const submission = await submissionResponse.json();
if (!submission.id) throw new Error('Production test message did not return an ID.');

try {
	const listResponse = await fetchWithRetry('/admin/messages?limit=100', { headers: adminHeaders });
	const list = await listResponse.json();
	const saved = list.messages?.find((message) => message.id === submission.id && message.content === marker);
	if (!saved) throw new Error('Production test message was not visible through the private administrator API.');
} finally {
	await fetchWithRetry(`/admin/messages/${submission.id}`, {
		method: 'DELETE',
		headers: adminHeaders,
	}, 204);
}

console.log('Production guestbook verification passed; the temporary message was deleted.');
