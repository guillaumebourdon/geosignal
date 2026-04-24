/**
 * Shared retry logic for Anthropic API calls with 429 rate limit handling.
 */

async function callWithRetry(anthropicClient, params, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await anthropicClient.messages.create(params);
    } catch (err) {
      const is429 = err?.status === 429
        || String(err?.message || err || '').includes('429')
        || String(err?.message || err || '').includes('rate_limit');
      if (is429 && attempt < maxRetries) {
        const retryAfter = Math.min(
          parseInt(err?.headers?.['retry-after'] || '0', 10) || (15 + attempt * 15),
          60
        );
        console.log(`[anthropic-retry] 429 rate limit, waiting ${retryAfter}s (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        continue;
      }
      throw err;
    }
  }
}

function parseJson(raw) {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object in Claude response');
  try { return JSON.parse(match[0]); } catch {
    // Strip control chars and retry
    const cleaned = match[0].replace(/[\x00-\x1f\x7f]/g, ch => ch === '\n' || ch === '\r' || ch === '\t' ? ' ' : '');
    return JSON.parse(cleaned);
  }
}

function parseJsonArray(raw) {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON array in Claude response');
  try { return JSON.parse(match[0]); } catch {
    const cleaned = match[0].replace(/[\x00-\x1f\x7f]/g, ch => ch === '\n' || ch === '\r' || ch === '\t' ? ' ' : '');
    return JSON.parse(cleaned);
  }
}

module.exports = { callWithRetry, parseJson, parseJsonArray };
