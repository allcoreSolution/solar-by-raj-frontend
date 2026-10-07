// Keep only digits and cap the length, e.g. digits("98a76-5", 10) -> "98765"
export const digits = (value, max) => String(value).replace(/\D/g, "").slice(0, max);