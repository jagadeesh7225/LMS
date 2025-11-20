// formatDate: takes an ISO date and returns it as DD-MM-YYYY.

export const formatDate = (iso) => {
  const d = new Date(iso);

  // return date in day-month-year format
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
};
