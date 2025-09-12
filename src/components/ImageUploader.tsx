import { useEffect, useRef, useState } from "react";

function formatSpanishCustom(date: Date) {
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

export default function ImageWithEditableDate() {
  const [preview, setPreview] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16);
    setDateTime(formatted);
  }, []);

  const loadFileToPreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFileToPreview(file);
  };

  const handleRemoveImage = () => setPreview(null);

  const handleDownload = () => {
    if (!preview || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      ctx.font = `${Math.floor(img.width * 0.025)}px Arial`;
      ctx.fillStyle = "white";
      ctx.textAlign = "right";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;

      const formatted = formatSpanishCustom(new Date(dateTime));
      ctx.fillText(formatted, img.width - 20, img.height - 20);

      const link = document.createElement("a");
      link.download = "imagen_con_fecha.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-gray-400 rounded-xl w-11/12 mx-auto">
      {/* Subir imagen desde archivos */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-400
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm
                   file:bg-[#399bf1] file:text-white
                   hover:file:bg-gray-500"
      />

      {/* Tomar foto con cámara */}
      <button
        type="button"
        onClick={() => cameraInputRef.current?.click()}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        Tomar foto con cámara
      </button>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview && (
        <>
          <div className="flex flex-col items-start w-full gap-2">
            <label className="text-sm font-medium text-gray-600">
              Fecha y hora
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="border rounded-lg p-2 text-sm w-full"
            />
          </div>

          <div className="relative w-full">
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black transition"
            >
              ×
            </button>

            <img src={preview} alt="Vista previa" className="w-full rounded-lg shadow-md" />
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {formatSpanishCustom(new Date(dateTime))}
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Guardar imagen con fecha
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
