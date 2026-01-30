import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import AIInputSection from "@/components/dashboard/AIInputSection"
import { useState, useEffect } from "react"
import { Package, Tag, DollarSign, Palette, Ruler, AlignLeft, VenusAndMars, ShoppingBag, MessageSquare, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Message } from "@/types"
import { ChatBubbleUser, ChatBubbleAI, ChatBubbleLoading } from "@/components/dashboard/ChatBubble"

export default
    function AgregarProducto({
        setStateToast
    }: {
        setStateToast: ({ message, variant }:
            { message: string, variant: "success" | "error" | "info" | "loading" }) => void
    }) {

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };

    // const handleSelectChange = (name: string, value: string) => {
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         const url = URL.createObjectURL(file);
    //         setFormData(prev => ({ ...prev, imageUrl: url }));
    //     }
    // };

    // const handleFormAgregarProducto = () => {
    //     setStateToast({
    //         message: "Producto agregado correctamente",
    //         variant: "success"
    //     })
    // }

    const [formData, setFormData] = useState<{
        nombre: string;
        precio: number;
        categoria: string;
        talla: never[];
        color: never[];
        genero: string;
        descripcion: string;
        imageUrl: string[];
    }>({
        nombre: '',
        precio: 0,
        categoria: '',
        talla: [],
        color: [],
        genero: '',
        descripcion: '',
        imageUrl: []
    });

    useEffect(() => {
        console.log(formData);
    }, [formData])

    const [messages, setMessages] = useState<Message[]>([]);

    const [isLoadingIA, setIsLoadingIA] = useState(false);

    const [viewChatHistory, setViewChatHistory] = useState(false);

    const handleViewChatHistory = () => {
        setViewChatHistory(!viewChatHistory);
    }

    const handleFormHelpIa = (updateFn: any) => {
        setFormData(prev => {
            const mockPrev: any = {
                name: prev.nombre,
                categoria: prev.categoria,
                genero: prev.genero,
            };
            const updated = typeof updateFn === 'function' ? updateFn(mockPrev) : updateFn;

            // Funcionalidad para acumular imágenes sin duplicados
            let newImageUrls = prev.imageUrl;
            if (updated.imageUrl && Array.isArray(updated.imageUrl)) {
                const newImages = updated.imageUrl;
                const existingSet = new Set(prev.imageUrl.filter(url => url && url.length > 0));

                // Agregar solo las imágenes nuevas que no existan
                newImages.forEach((img: string) => {
                    if (img && img.length > 0 && !existingSet.has(img)) {
                        newImageUrls = [...newImageUrls, img];
                    }
                });

                // Filtrar strings vacíos del inicio
                newImageUrls = newImageUrls.filter(url => url && url.length > 0);
            }

            return {
                ...prev,
                nombre: updated.name || updated.nombre || prev.nombre,
                categoria: updated.categoria || updated.product_category || prev.categoria,
                genero: updated.genero || updated.gender || prev.genero,
                descripcion: updated.description || updated.descripcion || prev.descripcion,
                precio: updated.precio || updated.price || prev.precio,
                color: updated.color || prev.color,
                talla: updated.talla || updated.size || prev.talla,
                imageUrl: newImageUrls,
            };
        });
    }

    useEffect(() => {
        if (viewChatHistory) return

        if (Array.isArray(messages) && messages.length > 0) {
            setViewChatHistory(true)
            return
        }
    }, [messages])

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-10">
            <Card
                title="Crea productos con IA"
                description="Describe el producto que quieres agregar y nuestra IA generará la información por ti"
                className="p-2">

                {/* Integrated Creation Flow - Vertical Stack */}
                <article className="flex flex-col items-center gap-12 w-full border-b border-slate-800/50 pb-6 mb-6">
                    {/* 1. Preview Section (Always Present) */}
                    <section className="w-full animate-in fade-in duration-700">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <ShoppingBag className="w-5 h-5 text-blue-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Estado de Previsualización</span>
                        </div>
                        <ProductPreview data={formData} />
                    </section>

                    {/* 2. Chat Section (Integrated below preview) */}
                    <section className={`w-full flex flex-col transition-all duration-300 ease-in-out ${viewChatHistory ? "gap-8" : "gap-0"}`}>
                        {/* Separator / Title */}
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-800/40" />
                            <div
                                onClick={handleViewChatHistory}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-sm cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg ${viewChatHistory ? "border-blue-500/50 bg-blue-500/10" : "border-slate-800/40 bg-slate-900/30 hover:border-blue-500/40 hover:bg-blue-500/5"}`}>
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Actividad de Creación</span>
                                <ChevronDown className={`size-5 text-slate-400 transition-all duration-300 ease-in-out ${viewChatHistory ? "rotate-180" : "rotate-0"}`} />
                            </div>
                            <div className="h-px flex-1 bg-linear-to-r from-slate-800/40 to-transparent" />
                        </div>

                        {/* Integrated Chat Box (Transparent & Integrated) */}
                        <div
                            className={`${viewChatHistory ? "h-100 py-2" : "h-0 mb-4"} max-h-100 overflow-y-auto px-4 custom-scrollbar transition-all duration-300 ease-in-out`}
                            style={{
                                maskImage: 'linear-gradient(to bottom, transparent, black 32px, black calc(100% - 32px), transparent)',
                                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 32px, black calc(100% - 32px), transparent)'
                            }}
                        >
                            <ChatHistory messages={messages} isLoading={isLoadingIA} />
                        </div>
                    </section>
                </article>


                <article className="pb-4">
                    <AIInputSection
                        isCreateMode
                        externalIsLoading={isLoadingIA}
                        setStateToast={setStateToast}
                        setExternalMessages={setMessages}
                        setExternalIsLoading={setIsLoadingIA}
                        handleAyudaIa={handleFormHelpIa}
                    />
                </article>
            </Card>
        </div>
    )
}

function ProductPreview({ data }: {
    data: {
        nombre: string;
        precio: number;
        categoria: string;
        talla: never[];
        color: never[];
        genero: string;
        descripcion: string;
        imageUrl: string[];
    }
}) {
    return (
        <div className="flex flex-col gap-4 p-5 rounded-3xl bg-slate-950/40 border border-slate-800/50 shadow-2xl backdrop-blur-xl group transition-all duration-300 hover:border-blue-500/30">
            <div className="flex gap-4 items-start">
                <ImageGallery imageUrls={data.imageUrl} />
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <h3 className="text-lg font-bold text-slate-100 truncate group-hover:text-blue-400 transition-colors">
                        {data.nombre || 'Nombre del Producto'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider shadow-inner">
                            <Tag size={12} />
                            {data.categoria || 'Categoría'}
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold shadow-inner">
                            <DollarSign size={12} />
                            {data.precio || '0.00'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 border-t border-slate-800/50 pt-4">
                <div className="flex items-center gap-2.5 text-xs">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <VenusAndMars size={14} className="text-purple-400" />
                    </div>
                    <span className="font-medium text-slate-400 uppercase tracking-tight">Género:</span>
                    <span className="text-slate-200 font-semibold">{data.genero || 'No especificado'}</span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <AlignLeft size={14} className="text-blue-400" />
                        </div>
                        <span className="font-medium uppercase tracking-tight">Descripción:</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pl-9 italic font-medium">
                        {data.descripcion || 'Escribe una descripción para verla aquí...'}
                    </p>
                </div>

                <div className="flex gap-6 pl-9">
                    {data.color.length ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                <Palette size={12} className="text-blue-400/70" />
                                Color
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {
                                    data.color.map((color: string, index: number) => (
                                        <span key={index} className="inline-flex px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-300 text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                            {color}
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                    ) : null
                    }
                    {data.talla.length ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                <Ruler size={12} className="text-purple-400/70" />
                                Talla
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {
                                    data.talla.map((talla: string, index: number) => (
                                        <span key={index} className="inline-flex px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-300 text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                            {talla}
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                    ) : null
                    }
                </div>
            </div>
        </div>
    )
}

function ChatHistory({ messages, isLoading }: { messages: Message[], isLoading: boolean }) {


    if (messages.length === 0 && !isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <MessageSquare size={24} className="text-blue-400 opacity-50" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1">Tu chat de creación</p>
                    <p className="text-[10px] text-slate-500 max-w-45">Dile a MoIA qué producto quieres crear hoy para empezar.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-4">
            {messages.map(({ role, content }, index) => (
                <div key={index} className="flex flex-col space-y-2">
                    {content.map((item, itemIndex) => {
                        const key = `${index}-${itemIndex}`;
                        if (role === 'user') {
                            if ((item.type === 'text' || item.type === 'input_text') && item.text) {
                                return <ChatBubbleUser key={key} message={item.text} />
                            }
                            if (item.type === 'input_image' && item.image_url) {
                                return <ChatBubbleUser className="w-50! aspect-square" key={key} image_url={item.image_url} />
                            }
                        }
                        if (role === 'assistant') {
                            if (item.type === 'text') {
                                return <ChatBubbleAI key={key} message={item.text} />
                            }
                        }
                        return null;
                    })}
                </div>
            ))}
            {isLoading && <ChatBubbleLoading />}
        </div>
    )
}

function FormClasico({
    data,
    onInputChange,
    onSelectChange,
    onImageChange
}: {
    data: any,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onSelectChange: (name: string, value: string) => void,
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <>
            {/* info */}
            <section className="flex flex-col gap-4">
                <Input
                    label="Nombre"
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder="Nombre del producto"
                    value={data.nombre}
                    onChange={onInputChange}
                />
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Precio"
                        type="number"
                        name="precio"
                        id="precio"
                        placeholder="Precio del producto"
                        value={data.precio}
                        onChange={onInputChange}
                    />

                    <Input
                        label="Categoria"
                        type="text"
                        name="categoria"
                        id="categoria"
                        placeholder="Categoria del producto"
                        value={data.categoria}
                        onChange={onInputChange}
                    />
                </section>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Talla"
                        name="talla"
                        id="talla"
                        value={data.talla}
                        onChange={(val) => onSelectChange("talla", val)}
                        options={[
                            { value: "S", label: "S" },
                            { value: "M", label: "M" },
                            { value: "L", label: "L" },
                            { value: "XL", label: "XL" },
                            { value: "XXL", label: "XXL" }
                        ]}
                    />
                    <Select
                        label="Color"
                        name="color"
                        id="color"
                        value={data.color}
                        onChange={(val) => onSelectChange("color", val)}
                        options={[
                            { value: "Rojo", label: "Rojo" },
                            { value: "Verde", label: "Verde" },
                            { value: "Azul", label: "Azul" },
                            { value: "Amarillo", label: "Amarillo" },
                            { value: "Negro", label: "Negro" },
                            { value: "Blanco", label: "Blanco" }
                        ]}
                    />
                </section>
                <Select
                    label="Genero"
                    name="genero"
                    id="genero"
                    value={data.genero}
                    onChange={(val) => onSelectChange("genero", val)}
                    options={[
                        { value: "Masculino", label: "Masculino" },
                        { value: "Femenino", label: "Femenino" },
                        { value: "Unisex", label: "Unisex" }
                    ]}
                />
                <Input
                    label="Descripcion"
                    type="text"
                    name="descripcion"
                    id="descripcion"
                    placeholder="Descripcion del producto"
                    value={data.descripcion}
                    onChange={onInputChange}
                />
                {/* imagen */}
                <section className="flex flex-col">
                    <label htmlFor="imagen" className="text-xs md:text-sm font-medium text-slate-300 ml-1 mb-2 block">Imagen</label>
                    <input
                        type="file"
                        name="imagen"
                        id="imagen"
                        onChange={onImageChange}
                        className="size-full flex-1 p-6 relative overflow-hidden group w-full bg-slate-950/50 border border-slate-800 rounded-2xl transition-all duration-300 hover:border-slate-700 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 text-slate-400"
                    />
                </section>
            </section>
        </>
    )
}

function ImageGallery({ imageUrls }: { imageUrls: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const validImages = imageUrls.filter((url) => url && url.length > 0);
    const hasImages = validImages.length > 0;

    const handlePrevious = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const handleNext = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    // {/* Galería Principal */}
    return (
        <div className="size-28 rounded-2xl bg-slate-900/80 border border-slate-800/50 overflow-hidden flex items-center justify-center relative group-hover:scale-[1.02] transition-transform duration-300 mb-3">
            {hasImages ? (
                <>
                    <div className="size-full relative">
                        {validImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                className={`absolute inset-0 size-full object-cover transition-all duration-500 ease-in-out ${index === currentIndex
                                    ? 'opacity-100 translate-x-0'
                                    : index < currentIndex
                                        ? 'opacity-0 -translate-x-full'
                                        : 'opacity-0 translate-x-full'
                                    }`}
                                alt={`Preview ${index}`}
                            />
                        ))}
                    </div>

                    {validImages.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                disabled={isTransitioning}
                                className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors disabled:opacity-50 z-10"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="size-4 text-white" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isTransitioning}
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors disabled:opacity-50 z-10"
                                aria-label="Next image"
                            >
                                <ChevronRight className="size-4 text-white" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {validImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => !isTransitioning && setCurrentIndex(index)}
                                        className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-blue-400 w-4'
                                            : 'bg-white/40 hover:bg-white/60'
                                            }`}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center gap-2 text-slate-600">
                    <Package className="size-10" />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Sin Imagen</span>
                </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 to-transparent pointer-events-none" />
        </div>

    );
}