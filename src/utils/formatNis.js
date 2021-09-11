function formatNis(amount) {
  return `₪ ${Math.round(amount).toLocaleString()}`;
}

module.exports = formatNis;
