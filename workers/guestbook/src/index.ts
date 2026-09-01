interface Env {
	DB: D1Database;
	ADMIN_TOKEN: string;
	CAPTCHA_SECRET: string;
	ALLOWED_ORIGINS?: string;
}

interface CaptchaRow {
	answer_hash: string;
	expires_at: number;
	used: number;
}

interface MessageRow {
	id: number;
	name: string;
	contact: string | null;
	content: string;
	created_at: number;
	read_at: number | null;
}

const API_PREFIX = '/api/guestbook';
const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const CAPTCHA_WINDOW_MS = 10 * 60 * 1000;
const CAPTCHA_LIMIT = 30;
const MESSAGE_WINDOW_MS = 10 * 60 * 1000;
const MESSAGE_LIMIT = 3;
const MESSAGE_DAY_MS = 24 * 60 * 60 * 1000;
const MESSAGE_DAY_LIMIT = 20;
const DEFAULT_ORIGINS = ['https://myair.info', 'https://www.myair.info', 'http://localhost:4321', 'http://127.0.0.1:4321'];
const encoder = new TextEncoder();

const GLYPHS: Record<string, string[]> = {
	'2': ['11110', '00001', '00001', '01110', '10000', '10000', '11111'],
	'3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
	'4': ['10010', '10010', '10010', '11111', '00010', '00010', '00010'],
	'5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
	'6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
	'7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
	'8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
	'9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
	A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
	B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
	C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
	D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
	E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
	F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
	G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
	H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
	J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
	K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
	L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
	M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
	N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
	P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
	Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
	R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
	S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
	T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
	U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
	V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
	W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
	X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
	Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
	Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
};

const CAPTCHA_CHARACTERS = Object.keys(GLYPHS).join('');

function randomInt(min: number, max: number): number {
	const value = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
	return min + (value % (max - min + 1));
}

function randomCode(length = 5): string {
	return Array.from({ length }, () => CAPTCHA_CHARACTERS[randomInt(0, CAPTCHA_CHARACTERS.length - 1)]).join('');
}

function renderCaptchaSvg(code: string): string {
	const colors = ['#075d89', '#176b87', '#324f78', '#315d64', '#5a4b78'];
	const glyphMarkup = Array.from(code).map((character, index) => {
		const rows = GLYPHS[character] ?? GLYPHS.A;
		const x = 13 + index * 34 + randomInt(-2, 2);
		const y = 9 + randomInt(-2, 2);
		const rotation = randomInt(-7, 7);
		const color = colors[randomInt(0, colors.length - 1)];
		const cells: string[] = [];
		rows.forEach((row, rowIndex) => {
			Array.from(row).forEach((cell, columnIndex) => {
				if (cell === '1') {
					cells.push(`<rect x="${x + columnIndex * 4.2}" y="${y + rowIndex * 6.2}" width="4.8" height="6.8" rx="1.2" />`);
				}
			});
		});
		return `<g fill="${color}" transform="rotate(${rotation} ${x + 11} ${y + 22})">${cells.join('')}</g>`;
	}).join('');

	const lines = Array.from({ length: 7 }, () => {
		const x1 = randomInt(0, 190);
		const y1 = randomInt(4, 60);
		const x2 = randomInt(0, 190);
		const y2 = randomInt(4, 60);
		const color = colors[randomInt(0, colors.length - 1)];
		return `<path d="M${x1} ${y1} Q${randomInt(45, 145)} ${randomInt(0, 64)} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${randomInt(1, 2)}" opacity="0.24" />`;
	}).join('');

	const dots = Array.from({ length: 52 }, () => {
		const color = colors[randomInt(0, colors.length - 1)];
		return `<circle cx="${randomInt(2, 188)}" cy="${randomInt(2, 62)}" r="${randomInt(1, 2)}" fill="${color}" opacity="0.18" />`;
	}).join('');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="64" viewBox="0 0 190 64" role="img"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#eef7fc"/><stop offset="1" stop-color="#f9fcfe"/></linearGradient></defs><rect width="190" height="64" rx="12" fill="url(#bg)"/>${dots}${glyphMarkup}${lines}</svg>`;
}

function toDataUri(svg: string): string {
	return `data:image/svg+xml;base64,${btoa(svg)}`;
}

async function sha256(value: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function captchaHash(env: Env, id: string, answer: string): Promise<string> {
	return sha256(`captcha:${env.CAPTCHA_SECRET}:${id}:${answer.toUpperCase()}`);
}

function constantTimeEqual(left: string, right: string): boolean {
	const a = encoder.encode(left);
	const b = encoder.encode(right);
	const length = Math.max(a.length, b.length);
	let difference = a.length ^ b.length;
	for (let index = 0; index < length; index += 1) {
		difference |= (a[index] ?? 0) ^ (b[index] ?? 0);
	}
	return difference === 0;
}

function allowedOrigins(env: Env): string[] {
	const configured = env.ALLOWED_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
	return configured.length ? configured : DEFAULT_ORIGINS;
}

function isOriginAllowed(request: Request, env: Env): boolean {
	const origin = request.headers.get('Origin');
	return !origin || allowedOrigins(env).includes(origin);
}

function responseHeaders(request: Request, env: Env, privateResponse = false): Headers {
	const headers = new Headers({
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': privateResponse ? 'private, no-store' : 'no-store',
		'X-Content-Type-Options': 'nosniff',
		'Referrer-Policy': 'no-referrer',
		'X-Frame-Options': 'DENY',
	});
	const origin = request.headers.get('Origin');
	if (origin && allowedOrigins(env).includes(origin)) {
		headers.set('Access-Control-Allow-Origin', origin);
		headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
		headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
		headers.set('Access-Control-Max-Age', '600');
		headers.set('Vary', 'Origin');
	}
	return headers;
}

function json(request: Request, env: Env, data: unknown, status = 200, privateResponse = false): Response {
	return new Response(JSON.stringify(data), { status, headers: responseHeaders(request, env, privateResponse) });
}

function normalizeSingleLine(value: unknown, maxLength: number): string {
	return String(value ?? '')
		.replace(/[\u0000-\u001f\u007f]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, maxLength);
}

function normalizeMessage(value: unknown): string {
	return String(value ?? '')
		.replace(/\r\n?/g, '\n')
		.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
		.trim();
}

function clientIp(request: Request): string {
	return request.headers.get('CF-Connecting-IP') ?? request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ?? 'unknown';
}

async function clientHash(request: Request, env: Env): Promise<string> {
	return sha256(`rate:${env.CAPTCHA_SECRET}:${clientIp(request)}`);
}

async function rateCount(env: Env, ipHash: string, action: string, since: number): Promise<number> {
	const row = await env.DB.prepare('SELECT COUNT(*) AS count FROM guestbook_rate_events WHERE ip_hash = ? AND action = ? AND created_at >= ?')
		.bind(ipHash, action, since)
		.first<{ count: number }>();
	return Number(row?.count ?? 0);
}

async function recordRateEvent(env: Env, ipHash: string, action: string, now: number): Promise<void> {
	await env.DB.prepare('INSERT INTO guestbook_rate_events (ip_hash, action, created_at) VALUES (?, ?, ?)')
		.bind(ipHash, action, now)
		.run();
}

async function cleanup(env: Env, now: number): Promise<void> {
	await env.DB.batch([
		env.DB.prepare('DELETE FROM guestbook_captchas WHERE expires_at < ?').bind(now - CAPTCHA_TTL_MS),
		env.DB.prepare('DELETE FROM guestbook_rate_events WHERE created_at < ?').bind(now - MESSAGE_DAY_MS),
	]);
}

async function handleCaptcha(request: Request, env: Env): Promise<Response> {
	if (!isOriginAllowed(request, env)) return json(request, env, { ok: false, code: 'origin_not_allowed' }, 403);
	const now = Date.now();
	const ipHash = await clientHash(request, env);
	if (await rateCount(env, ipHash, 'captcha', now - CAPTCHA_WINDOW_MS) >= CAPTCHA_LIMIT) {
		return json(request, env, { ok: false, code: 'rate_limited' }, 429);
	}

	const id = crypto.randomUUID();
	const code = randomCode();
	const answerHash = await captchaHash(env, id, code);
	await env.DB.batch([
		env.DB.prepare('INSERT INTO guestbook_captchas (id, answer_hash, created_at, expires_at, used) VALUES (?, ?, ?, ?, 0)')
			.bind(id, answerHash, now, now + CAPTCHA_TTL_MS),
		env.DB.prepare('INSERT INTO guestbook_rate_events (ip_hash, action, created_at) VALUES (?, ?, ?)')
			.bind(ipHash, 'captcha', now),
	]);
	if (randomInt(1, 10) === 1) await cleanup(env, now);

	return json(request, env, {
		ok: true,
		challengeId: id,
		image: toDataUri(renderCaptchaSvg(code)),
		expiresAt: new Date(now + CAPTCHA_TTL_MS).toISOString(),
	});
}

async function verifyCaptcha(env: Env, id: string, answer: string, now: number): Promise<boolean> {
	const row = await env.DB.prepare('SELECT answer_hash, expires_at, used FROM guestbook_captchas WHERE id = ?')
		.bind(id)
		.first<CaptchaRow>();
	if (!row || row.used || row.expires_at < now) return false;
	const submittedHash = await captchaHash(env, id, answer);
	const valid = constantTimeEqual(submittedHash, row.answer_hash);
	const consumed = await env.DB.prepare('UPDATE guestbook_captchas SET used = 1 WHERE id = ? AND used = 0')
		.bind(id)
		.run();
	return valid && Number(consumed.meta.changes ?? 0) === 1;
}

async function parseJsonBody(request: Request): Promise<Record<string, unknown> | null> {
	const contentLength = Number(request.headers.get('Content-Length') ?? 0);
	if (contentLength > 1_000_000) return null;
	try {
		const text = await request.text();
		if (encoder.encode(text).byteLength > 1_000_000) return null;
		const body = JSON.parse(text);
		return body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : null;
	} catch {
		return null;
	}
}

async function handleSubmission(request: Request, env: Env): Promise<Response> {
	if (!isOriginAllowed(request, env)) return json(request, env, { ok: false, code: 'origin_not_allowed' }, 403);
	const body = await parseJsonBody(request);
	if (!body) return json(request, env, { ok: false, code: 'invalid_request' }, 400);

	if (normalizeSingleLine(body.website, 200)) {
		return json(request, env, { ok: true }, 201);
	}

	const name = normalizeSingleLine(body.name, 32);
	const contact = normalizeSingleLine(body.contact, 120);
	const content = normalizeMessage(body.content);
	const captchaId = normalizeSingleLine(body.captchaId, 80);
	const captchaAnswer = normalizeSingleLine(body.captchaAnswer, 5).toUpperCase();
	const lineCount = content ? content.split('\n').length : 0;
	if (!name || !content || content.length < 2 || lineCount > 3000 || !captchaId || captchaAnswer.length !== 5) {
		return json(request, env, { ok: false, code: 'invalid_fields' }, 400);
	}

	const now = Date.now();
	const ipHash = await clientHash(request, env);
	const [shortWindow, dayWindow] = await Promise.all([
		rateCount(env, ipHash, 'message', now - MESSAGE_WINDOW_MS),
		rateCount(env, ipHash, 'message', now - MESSAGE_DAY_MS),
	]);
	if (shortWindow >= MESSAGE_LIMIT || dayWindow >= MESSAGE_DAY_LIMIT) {
		return json(request, env, { ok: false, code: 'rate_limited' }, 429);
	}

	if (!await verifyCaptcha(env, captchaId, captchaAnswer, now)) {
		return json(request, env, { ok: false, code: 'captcha_invalid' }, 400);
	}

	const results = await env.DB.batch([
		env.DB.prepare('INSERT INTO guestbook_messages (name, contact, content, created_at, read_at) VALUES (?, ?, ?, ?, NULL)')
			.bind(name, contact || null, content, now),
		env.DB.prepare('INSERT INTO guestbook_rate_events (ip_hash, action, created_at) VALUES (?, ?, ?)')
			.bind(ipHash, 'message', now),
	]);
	const id = Number(results[0]?.meta.last_row_id ?? 0);
	return json(request, env, { ok: true, id }, 201);
}

function adminToken(request: Request): string {
	const authorization = request.headers.get('Authorization') ?? '';
	return authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
}

function isAdmin(request: Request, env: Env): boolean {
	return Boolean(env.ADMIN_TOKEN) && constantTimeEqual(adminToken(request), env.ADMIN_TOKEN);
}

function serializeMessage(row: MessageRow) {
	return {
		id: row.id,
		name: row.name,
		contact: row.contact ?? '',
		content: row.content,
		createdAt: new Date(row.created_at).toISOString(),
		readAt: row.read_at ? new Date(row.read_at).toISOString() : null,
	};
}

async function handleAdminList(request: Request, env: Env, url: URL): Promise<Response> {
	if (!isAdmin(request, env)) return json(request, env, { ok: false, code: 'unauthorized' }, 401, true);
	const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? 50) || 50));
	const cursor = Math.max(0, Number(url.searchParams.get('cursor') ?? 0) || 0);
	const query = cursor
		? env.DB.prepare('SELECT id, name, contact, content, created_at, read_at FROM guestbook_messages WHERE id < ? ORDER BY id DESC LIMIT ?').bind(cursor, limit)
		: env.DB.prepare('SELECT id, name, contact, content, created_at, read_at FROM guestbook_messages ORDER BY id DESC LIMIT ?').bind(limit);
	const result = await query.all<MessageRow>();
	const rows = result.results ?? [];
	return json(request, env, {
		ok: true,
		messages: rows.map(serializeMessage),
		nextCursor: rows.length === limit ? String(rows[rows.length - 1]?.id ?? '') : null,
	}, 200, true);
}

async function handleAdminUpdate(request: Request, env: Env, id: number): Promise<Response> {
	if (!isAdmin(request, env)) return json(request, env, { ok: false, code: 'unauthorized' }, 401, true);
	const body = await parseJsonBody(request);
	if (!body || typeof body.read !== 'boolean') return json(request, env, { ok: false, code: 'invalid_request' }, 400, true);
	const readAt = body.read ? Date.now() : null;
	const result = await env.DB.prepare('UPDATE guestbook_messages SET read_at = ? WHERE id = ?').bind(readAt, id).run();
	if (!Number(result.meta.changes ?? 0)) return json(request, env, { ok: false, code: 'not_found' }, 404, true);
	return json(request, env, { ok: true, readAt: readAt ? new Date(readAt).toISOString() : null }, 200, true);
}

async function handleAdminDelete(request: Request, env: Env, id: number): Promise<Response> {
	if (!isAdmin(request, env)) return json(request, env, { ok: false, code: 'unauthorized' }, 401, true);
	const result = await env.DB.prepare('DELETE FROM guestbook_messages WHERE id = ?').bind(id).run();
	if (!Number(result.meta.changes ?? 0)) return json(request, env, { ok: false, code: 'not_found' }, 404, true);
	return new Response(null, { status: 204, headers: responseHeaders(request, env, true) });
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	if (!url.pathname.startsWith(API_PREFIX)) return json(request, env, { ok: false, code: 'not_found' }, 404);
	if (request.method === 'OPTIONS') {
		if (!isOriginAllowed(request, env)) return json(request, env, { ok: false, code: 'origin_not_allowed' }, 403);
		return new Response(null, { status: 204, headers: responseHeaders(request, env) });
	}
	if (url.pathname === `${API_PREFIX}/health` && request.method === 'GET') {
		return json(request, env, { ok: true, service: 'guestbook' });
	}
	if (url.pathname === `${API_PREFIX}/captcha` && request.method === 'GET') {
		return handleCaptcha(request, env);
	}
	if (url.pathname === `${API_PREFIX}/messages` && request.method === 'POST') {
		return handleSubmission(request, env);
	}
	if (url.pathname === `${API_PREFIX}/admin/messages` && request.method === 'GET') {
		return handleAdminList(request, env, url);
	}
	const adminMatch = url.pathname.match(new RegExp(`^${API_PREFIX}/admin/messages/(\\d+)$`));
	if (adminMatch) {
		const id = Number(adminMatch[1]);
		if (request.method === 'PATCH') return handleAdminUpdate(request, env, id);
		if (request.method === 'DELETE') return handleAdminDelete(request, env, id);
	}
	return json(request, env, { ok: false, code: 'not_found' }, 404);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		try {
			return await handleRequest(request, env);
		} catch (error) {
			console.error('Guestbook worker error', error);
			return json(request, env, { ok: false, code: 'server_error' }, 500, true);
		}
	},
} satisfies ExportedHandler<Env>;
