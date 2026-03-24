export function formatNumber(value, digits = 4) {
  if (value == null || Number.isNaN(value)) return "—";
  if (Math.abs(value) >= 10000) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return parseFloat(value.toFixed(digits)).toString();
}
