function maskEmail(email) {
  if (!email || typeof email !== 'string') return '***';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return `${local.substring(0, 2)}***@${domain}`;
}

module.exports = { maskEmail };
