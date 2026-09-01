const apiBase = process.env.GUESTBOOK_API_BASE ?? 'https://myair.info/api/guestbook';
const adminToken = process.env.GUESTBOOK_ADMIN_TOKEN;
const marker = `deployment-check-${(process.env.GITHUB_SHA ?? Date.now().toString()).slice(0, 12)}`;
const messageContent = [marker, ...Array.from({ length: 7_999 }, (_, index) => `line-${index + 2}`)].join('\n');

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

const imageBytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
const submissionBody = new FormData();
submissionBody.set('name', 'Deployment check');
submissionBody.set('contact', '');
submissionBody.set('content', messageContent);
submissionBody.set('captchaId', captcha.challengeId);
submissionBody.set('captchaAnswer', captcha.answer);
submissionBody.set('website', '');
submissionBody.append('images', new Blob([imageBytes], { type: 'image/png' }), 'deployment-check.png');

const submissionResponse = await fetchWithRetry('/messages', {
	method: 'POST',
	headers: {
		Accept: 'application/json',
		Authorization: `Bearer ${adminToken}`,
		Origin: 'https://myair.info',
	},
	body: submissionBody,
}, 201);
const submission = await submissionResponse.json();
if (!submission.id) throw new Error('Production test message did not return an ID.');

try {
	const listResponse = await fetchWithRetry('/admin/messages?limit=100', { headers: adminHeaders });
	const list = await listResponse.json();
	const saved = list.messages?.find((message) => message.id === submission.id && message.content === messageContent);
	if (!saved) throw new Error('Production test message was not visible through the private administrator API.');
	const attachment = saved.attachments?.find((item) => item.name === 'deployment-check.png');
	if (!attachment?.downloadPath) throw new Error('Production test image metadata was not visible through the private administrator API.');
	await fetchWithRetry(attachment.downloadPath.replace('/api/guestbook', ''), { headers: { Accept: 'image/*' } }, 401);
	const imageResponse = await fetchWithRetry(attachment.downloadPath.replace('/api/guestbook', ''), { headers: adminHeaders });
	if (imageResponse.headers.get('Content-Type') !== 'image/png') throw new Error('Private image response has the wrong content type.');
	const downloaded = Buffer.from(await imageResponse.arrayBuffer());
	if (!downloaded.equals(imageBytes)) throw new Error('Private image response did not match the uploaded image.');
} finally {
	await fetchWithRetry(`/admin/messages/${submission.id}`, {
		method: 'DELETE',
		headers: adminHeaders,
	}, 204);
}

console.log('Production guestbook verification passed; the temporary message was deleted.');
