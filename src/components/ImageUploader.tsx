import { useEffect, useRef, useState } from "react";

function formatSpanishCustom(date: Date) {
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
        return "Fecha inválida";
    }

    const day = date.getDate();
    const months = [
        "ene", "feb", "mar", "abr", "may", "jun",
        "jul", "ago", "sept", "oct", "nov", "dic"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const suffix = hours >= 12 ? "p.m." : "a.m.";
    hours = hours % 12 || 12;

    return `${day} ${month} ${year} ${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${suffix}`;
}

export default function ImageWithEditableDate() {
    const [preview, setPreview] = useState<string | null>(null);
    const [dateTime, setDateTime] = useState<string>("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            ctx.font = `${Math.floor(img.width * 0.04)}px Arial`;
            ctx.fillStyle = "white";
            ctx.textAlign = "right";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 4;

            const formatted = formatSpanishCustom(new Date(dateTime));
            ctx.fillText(formatted, img.width - 20, img.height - 20);

            const dateObj = new Date(dateTime);
            // Verificar si la fecha es válida antes de usarla
            if (!isNaN(dateObj.getTime())) {
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                const dd = String(dateObj.getDate()).padStart(2, "0");

                const minutes = String(dateObj.getMinutes()).padStart(2, "0");
                const seconds = String(dateObj.getSeconds()).padStart(2, "0");

                const hour12 = dateObj.getHours() % 12 || 12;
                const suffix = dateObj.getHours() >= 12 ? "PM" : "AM";

                const fileName = `WhatsApp Image ${yyyy}-${mm}-${dd} at ${hour12}.${minutes}.${seconds} ${suffix}.jpeg`;

                const link = document.createElement("a");
                link.download = fileName;
                link.href = canvas.toDataURL("image/jpeg");
                link.click();
            } else {
                console.error("Fecha inválida para el nombre del archivo");
            }
        };
    };

    const getFormattedDate = () => {
        const date = new Date(dateTime);
        return isNaN(date.getTime()) ? "Selecciona una fecha válida" : formatSpanishCustom(date);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border border-gray-400 rounded-xl w-11/12 mx-auto my-4">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="flex gap-4 w-full justify-center">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors w-24 h-24"
                    title="Seleccionar archivo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span className="mt-2 text-xs text-blue-600">Archivo</span>
                </button>

                <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors w-24 h-24"
                    title="Tomar foto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="mt-2 text-xs text-purple-600">Cámara</span>
                </button>
            </div>

            {preview && (
                <>
                    <div className="flex flex-col items-start w-full gap-2">
                        <label className="text-sm font-medium text-gray-400">
                            Fecha y hora
                        </label>
                        <div className="flex gap-2 w-full">
                            <div className="relative w-1/2">
                                <input
                                    type="date"
                                    value={dateTime.split('T')[0]}
                                    onChange={(e) => {
                                        const timePart = dateTime.split('T')[1] || '00:00';
                                        setDateTime(`${e.target.value}T${timePart}`);
                                    }}
                                    className="bg-[#1d2733] border-b border-gray-300 text-gray-300 p-2 text-xs w-full
                                        [&::-webkit-calendar-picker-indicator]:opacity-0
                                        focus:outline-none focus:border-blue-500 pr-10"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="relative w-1/2">
                                <input
                                    type="time"
                                    value={dateTime.split('T')[1]?.substring(0, 5) || '00:00'}
                                    step="1"
                                    onChange={(e) => {
                                        const datePart = dateTime.split('T')[0];
                                        setDateTime(`${datePart}T${e.target.value}`);
                                    }}
                                    className="bg-[#1d2733] border-b border-gray-300 text-gray-300 p-2 text-xs w-full
                                        [&::-webkit-calendar-picker-indicator]:opacity-0
                                        focus:outline-none focus:border-blue-500 pr-10"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full">

                        <button
                            onClick={handleDownload}
                            className="absolute top-2 left-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black transition"
                            title="Guardar imagen con fecha"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                        </button>

                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black transition"
                            title="Eliminar imagen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <img src={preview} alt="Vista previa" className="w-full rounded-lg shadow-md" />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {getFormattedDate()}
                        </div>
                    </div>
                </>
            )}

            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
}