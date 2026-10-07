const UNIT_PRICE = 8;        // Rs per unit of electricity
const UNITS_PER_KW = 120;    // units one kW makes in a month
const COST_PER_KW = 55000;   // Rs per kW installed
const SAVING_SHARE = 0.85;   // share of the bill that solar removes
const ratio = { Home: 1, Commercial: 0.93, Industry: 0.88, Farmhouse: 1 };

export const estimate = (bill, type = "Home") => {
  const kw = Math.max(1, Math.round((bill / UNIT_PRICE / UNITS_PER_KW) * (ratio[type] ?? 1) * 2) / 2);
  const cost = kw * COST_PER_KW;
  const yearly = bill * 12 * SAVING_SHARE;
  return { kw, cost, yearly, payback: cost / yearly, co2: Math.round(kw * 1.3) };
};

export const inr = (n) =>
  n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)} L` : `₹${Math.round(n).toLocaleString("en-IN")}`;