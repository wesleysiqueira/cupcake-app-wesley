export const formatDateToBR = (date: string) => {
  // Remove any non-digit characters
  const cleaned = date.replace(/\D/g, "");

  // Format as DD/MM/YYYY
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 4) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  } else {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }
};

export const formatDateToUS = (date: string) => {
  // Convert from DD/MM/YYYY to YYYY-MM-DD
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export const isValidDate = (date: string) => {
  const [day, month] = date.split("/").map(Number);

  if (day > 31 || day < 1 || month > 12 || month < 1) {
    return false;
  }

  return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
};

export const isFutureDate = (date: string) => {
  if (!isValidDate(date)) return false;

  const [day, month, year] = date.split("/").map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate >= today;
};

export function formatDateInput(value: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, "");

  // Limita a 8 dígitos (DDMMAAAA)
  const limited = numbers.slice(0, 8);

  // Adiciona as barras
  if (limited.length > 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  } else if (limited.length > 2) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  }

  return limited;
}
