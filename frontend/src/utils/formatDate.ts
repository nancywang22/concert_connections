export function formatDate(dateStr: string) {
  if (!dateStr) return "";

  // Handles DD-MM-YYYY from Setlist.fm
  const [day, month, year] = dateStr.split("-");
  return `${month}-${day}-${year}`;
}
