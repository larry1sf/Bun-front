import { Message, tform } from "@/types"
import { X, Check, Paperclip, Plus, Images } from "lucide-react"
import { useState, useRef, ChangeEvent } from "react"
import { useChat } from "../context/contextInfoChat"
import { useDropDown } from "../hooks/dropDown"
import { ChatSendButton } from "./ChatSendButton"

interface ImageFile {
    file: File;
    preview: string;
}


export default function AIInputSection({ handleAyudaIa, setStateToast }: {
    setStateToast: ({ message, variant }: { message: string, variant: "success" | "error" | "info" | "loading" }) => void
    handleAyudaIa?: (ayudaIa: (tform | ((prev: tform) => tform))) => void
}) {
    // contexto
    const { isLoading, message, setIsLoading, setMessages, setMessage } = useChat()
    // estados
    const [selectedImages, setSelectedImages] = useState<ImageFile[]>([])
    const [isVisionEnabled, setIsVisionEnabled] = useState(false)
    // referencias
    const refTextArea = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    const { ref: menuRef, isDropdownOpen: isMobileMenuOpen, setIsDropdownOpen: setIsMobileMenuOpen } = useDropDown()

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        Promise.all(
            files.map(
                file =>
                    new Promise<{ file: File; preview: string }>((resolve, reject) => {
                        // Validaciones opcionales
                        if (!file.type.startsWith("image/")) {
                            reject(new Error("Archivo no es imagen"));
                            return;
                        }

                        const reader = new FileReader();
                        reader.onload = () =>
                            resolve({
                                file,
                                preview: reader.result as string
                            });
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    })
            )
        )
            .then(images => {
                setSelectedImages(prev => [...prev, ...images]);
            })
            .catch(console.error);

        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const removeImage = (index: number) => {
        setSelectedImages(prev => {
            const newImages = [...prev]
            URL.revokeObjectURL(newImages[index].preview)
            newImages.splice(index, 1)
            return newImages
        })
    }

    const sendMessage = (message: Message) => {
        setIsLoading(true);
        const controller = new AbortController();
        abortControllerRef.current = controller;

        fetch('/api/buscar-productos/ia', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [message],
                visionEnabled: isVisionEnabled
            }),
            signal: controller.signal
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    const errorMessage = errorData.message || errorData.error || 'El servidor de IA no responde correctamente';
                    throw new Error(`${errorMessage} (Status: ${res.status})`);
                }
                return res.json();
            })
            .then(data => {
                if (!data?.respuesta) throw new Error("La IA no devolvió una respuesta válida");

                const responseText = data.respuesta;
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error("No se pudo interpretar la sugerencia de la IA");

                try {
                    const parsedData = JSON.parse(jsonMatch[0]);
                    const normalized: Partial<tform> = {};

                    // Mapeo inteligente de llaves
                    if (parsedData.name || parsedData.nombre) normalized.name = parsedData.name || parsedData.nombre;
                    if (parsedData.categoria || parsedData.category) normalized.categoria = parsedData.categoria || parsedData.category;
                    if (parsedData.genero || parsedData.gender) normalized.genero = parsedData.genero || parsedData.gender;
                    if (parsedData.clothing_type || parsedData.tipo_ropa || parsedData.clothingType)
                        normalized.clothing_type = parsedData.clothing_type || parsedData.tipo_ropa || parsedData.clothingType;

                    if (Object.keys(normalized).length === 0) throw new Error("No se encontró información relevante");

                    return normalized;
                } catch (e) {
                    throw new Error("Formato de sugerencia inválido");
                }
            })
            .then(res => {
                if (handleAyudaIa) {
                    handleAyudaIa((prev: tform) => ({ ...prev, ...res }));
                    setStateToast({ message: "Sugerencia aplicada con éxito", variant: "success" });
                }
            })
            .catch((error) => {
                if (error.name === 'AbortError') return;

                console.error('AI Error:', error);
                setStateToast({
                    message: error instanceof Error ? error.message : "Error al procesar la sugerencia",
                    variant: "error"
                });
            })
            .finally(() => {
                setIsLoading(false);
                abortControllerRef.current = null;
                // Limpiamos siempre al finalizar el proceso
                setMessage(null);
                setSelectedImages([]);
            });
    }

    const handleSend = () => {
        if (isLoading) {
            abortControllerRef.current?.abort()
            return
        }

        const messageVal = refTextArea.current?.value
        if (!messageVal && selectedImages.length === 0) return

        let preview: { type: "input_image", image_url: string }[] | null = null
        if (isVisionEnabled)
            preview = selectedImages.map(({ preview }) => ({ type: "input_image", image_url: preview }))

        const newMessage: Message = {
            role: 'user',
            content: [
                { type: isVisionEnabled ? 'input_text' : 'text', text: messageVal || "" },
                ...(isVisionEnabled && preview ? preview : [])
            ]
        }

        setMessage(newMessage)
        setMessages((prevMessages: Message[]) => [...prevMessages, newMessage])
        sendMessage(newMessage)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const handleClickNoActive = () => {
        if (!isVisionEnabled) {
            setStateToast({ message: "La funcion de vision no esta disponible", variant: "error" });
            return;
        }
        fileInputRef.current?.click()
    }

    return (
        <>
            {/* Main Container */}
            <div className={`
                            ${isLoading ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20' : 'border-white/10 shadow-xl'} 
                            relative flex flex-col bg-slate-900/95 border backdrop-blur-3xl rounded-4xl overflow-visible focus-within:border-blue-500/40 focus-within:shadow-[0_0_25px_rgba(59,130,246,0.1)] transition-all duration-500
                        `}>
                {/* Animated Loading Bar (Only visible when loading) */}
                {isLoading && (
                    <div className="absolute overflow-hidden px-4 md:px-6 top-0 left-0 right-0 size-full rounded-4xl">
                        <div className="absolute px-4 md:px-6 top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-blue-500 to-transparent animate-shimmer z-10"></div>
                    </div>
                )}

                {/* Preview images Area (Inside) */}
                {(isVisionEnabled && selectedImages.length > 0) && (
                    <div className="flex flex-wrap gap-3 p-4 pb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        {selectedImages.map((img, index) => (
                            <div key={index} className="relative group/img w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-slate-800/50 shadow-inner">
                                <img
                                    src={img.preview}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-slate-950 text-white rounded-full p-1 border border-white/20 transition-all hover:scale-110 shadow-lg"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Box Layout Container */}
                <div className="flex flex-col">
                    {/* Textarea Area */}
                    <div className="px-4 pt-2">
                        <textarea
                            ref={refTextArea}
                            disabled={isLoading}
                            value={message?.content[0] && 'text' in message.content[0] ? message.content[0].text : ''}
                            onChange={(e) => setMessage({ role: 'user', content: [{ type: isVisionEnabled ? 'input_text' : 'text', text: e.target.value }] })}
                            onKeyDown={handleKeyDown}
                            placeholder={isLoading ? "La IA está procesando..." : "Escribe un mensaje..."}
                            wrap="soft"
                            className={`
                                            w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500/80 py-4 px-2 resize-none min-w-0 whitespace-pre-wrap wrap-break-word custom-scrollbar outline-none text-sm md:text-base field-sizing-content h-auto max-h-60 overflow-y-auto transition-opacity duration-300
                                            ${isLoading ? 'opacity-50 select-none' : 'opacity-100'}
                                        `}
                        />
                    </div>

                    {/* Actions Row Mobile */}
                    <div className="md:hidden flex items-center justify-between px-5 pb-4 relative">
                        {/* Menu Dropdown & Toggle */}
                        <div className="flex items-center gap-2" ref={menuRef}>
                            <div className="relative">
                                {/* Dropdown Menu */}
                                <div className={`
                                                absolute bottom-full left-0 mb-3 flex flex-col gap-2 transition-all duration-300 origin-bottom-left z-20
                                                ${isMobileMenuOpen
                                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                                    }
                                            `}>
                                    <div className="p-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col gap-2 min-w-[140px]">
                                        {/* Vision Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newValue = !isVisionEnabled;
                                                setIsVisionEnabled(newValue);
                                                if (!newValue) setSelectedImages([]);
                                            }}
                                            className={`
                                                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                                                            ${isVisionEnabled
                                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                                    : 'hover:bg-white/5 text-slate-400 border border-transparent'
                                                }
                                                        `}
                                        >
                                            <div className={`
                                                            flex items-center justify-center w-5 h-5 rounded-md transition-all duration-300
                                                            ${isVisionEnabled ? 'bg-blue-500 text-white rotate-0 scale-100' : 'bg-slate-700/50 text-slate-500'}
                                                        `}>
                                                {isVisionEnabled ? <Check size={14} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                                            </div>
                                            <span className="text-xs font-semibold tracking-wide">Visión</span>
                                        </button>

                                        {/* Upload Image */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleClickNoActive();
                                            }}
                                            className={`
                                                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                                                            ${isVisionEnabled
                                                    ? 'text-slate-200 hover:bg-white/5'
                                                    : 'text-slate-500 hover:text-slate-400 cursor-not-allowed opacity-60'
                                                }
                                                        `}
                                        >
                                            <Paperclip size={18} />
                                            <span className="text-xs font-medium">Adjuntar</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className={`
                                                    flex items-center justify-center p-3 rounded-2xl transition-all duration-300 border
                                                    ${isMobileMenuOpen
                                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 rotate-90'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                        }
                                                `}
                                >
                                    <Plus size={20} className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Send Button Mobile */}
                        <ChatSendButton
                            onClick={handleSend}
                            isLoading={isLoading}
                            isDisabled={(!refTextArea.current?.value && selectedImages.length === 0) && !isLoading}
                        />
                    </div>

                    {/* Actions Row Desktop*/}
                    <div className="hidden md:flex items-center justify-between px-5 pb-4">
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    const newValue = !isVisionEnabled;
                                    setIsVisionEnabled(newValue);
                                    if (!newValue) {
                                        setSelectedImages([]);
                                    }
                                }}
                                disabled={isLoading}
                                className={`
                                                    group relative flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all duration-300 border active:scale-95 scale-100 active:shadow-lg
                                                    ${isVisionEnabled
                                        ? 'bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                                    }
                                                `}
                            >
                                <div className={`
                                                    flex items-center justify-center w-5 h-5 rounded-md transition-all duration-300
                                                    ${isVisionEnabled ? 'bg-blue-500 text-white rotate-0 scale-100 shadow-sm' : 'bg-slate-700/50 text-slate-500 -rotate-90 scale-90'}
                                                `}>
                                    {isVisionEnabled ? <Check size={14} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                                </div>
                                <span className="text-xs font-bold tracking-wider uppercase">Visión</span>
                                <Images size={19} className={`transition-transform duration-300 ${isVisionEnabled ? 'scale-110' : 'scale-100 opacity-70'}`} />

                                {/* Indicator Glow */}
                                {isVisionEnabled && (
                                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 border border-slate-900"></span>
                                    </span>
                                )}
                            </button>
                            {/* Button to upload images */}
                            <button
                                type="button"
                                onClick={handleClickNoActive}
                                disabled={isLoading}
                                className={`
                                                group/img flex cursor-pointer items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-300 border active:scale-95 scale-100 active:shadow-lg
                                                ${isVisionEnabled
                                        ? 'text-blue-400/90 hover:text-blue-300 hover:bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5'
                                        : 'text-slate-600 border-white/5 bg-white/2 opacity-80 hover:bg-white/4'
                                    }
                                            `}
                                title={isVisionEnabled ? "Adjuntar imágenes" : "Habilita Visión para adjuntar imágenes"}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Paperclip size={20} className={`transition-transform duration-300 ${isVisionEnabled ? 'group-hover/img:rotate-12 group-hover/img:scale-110' : ''}`} />

                            </button>
                        </div>

                        <div className="flex items-center">
                            <ChatSendButton
                                onClick={handleSend}
                                isLoading={isLoading}
                                isDisabled={(!refTextArea.current?.value && selectedImages.length === 0) && !isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal Notice */}
            <p className=" text-xs md:text-sm text-slate-400 text-center mt-3 font-medium opacity-60">
                MoIA puede cometer errores. Considera verificar la información importante.
            </p>
        </>
    )
}