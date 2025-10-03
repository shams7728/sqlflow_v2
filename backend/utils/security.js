function sanitizeQuery(query, allowDDL = false) {
  const lowered = query.toLowerCase();
  
  // For practice exercises that teach DDL, allow ALTER, CREATE, DROP
  const banned = allowDDL 
    ? ['attach'] // Only block dangerous operations
    : ['insert', 'update', 'delete', 'drop', 'alter', 'create', 'attach'];
  
  for (let word of banned) {
    if (lowered.includes(word)) throw new Error(`Operation not allowed: ${word}`);
  }

  const joinCount = (lowered.match(/join/g) || []).length;
  if (joinCount > 3) throw new Error('Too many JOINs');

  return query;
}

module.exports = { sanitizeQuery };
