export function formatCustomDate(date: Date) {
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"
  ];

  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const año = date.getFullYear();

  let horas = date.getHours();
  const minutos = date.getMinutes().toString().padStart(2, "0");
  const segundos = date.getSeconds().toString().padStart(2, "0");
  const sufijo = horas >= 12 ? "p.m." : "a.m.";

  if (horas > 12) horas -= 12;
  if (horas === 0) horas = 12;

  return `${dia} de ${mes}, ${año} ${horas}:${minutos}:${segundos} ${sufijo}`;
}
