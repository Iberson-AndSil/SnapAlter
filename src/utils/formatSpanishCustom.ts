export function formatSpanishCustom(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString("es-ES", { month: "long" });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const suffix = hours >= 12 ? "p.m." : "a.m.";
  hours = hours % 12 || 12;

  return `${day} de ${month}, ${year} ${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${suffix}`;
}
