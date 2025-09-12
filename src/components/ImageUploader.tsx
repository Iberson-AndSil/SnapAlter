import { useState } from "react";

export default function ImageUploader() {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border border-gray-400 rounded-xl w-11/12 mx-auto">
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

            {preview && (
                <img
                    src={preview}
                    alt="Vista previa"
                    className="w-full rounded-lg shadow-md"
                />
            )}
        </div>
    );
}
