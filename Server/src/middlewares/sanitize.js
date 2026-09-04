const isPlainObject = (val) =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

const sanitizeInPlace = (obj) => {
  if (!isPlainObject(obj) && !Array.isArray(obj)) return obj;

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    const value = obj[key];
    if (isPlainObject(value) || Array.isArray(value)) {
      sanitizeInPlace(value);
    }
  }
  return obj;
};

const sanitize = (req, res, next) => {
  if (req.body) sanitizeInPlace(req.body);
  if (req.query) sanitizeInPlace(req.query);
  if (req.params) sanitizeInPlace(req.params);
  next();
};

module.exports = sanitize;
