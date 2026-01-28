'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Package, X, Save, DollarSign, Type, Tag, Palette, Ruler, AlignLeft, VenusAndMars, Loader2 } from "lucide-react";


interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, updatedData: any) => Promise<void> | void;
    producto: any;
}

export const EditProductModal = ({
    isOpen,
    onClose,
    onSave,
    producto
}: EditProductModalProps) => {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        gender: '',
        clothing_type: '',
        description: '',
        color: [] as string[],
        size: [] as string[],
        slug: '',
    });
    const [sizeError, setSizeError] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const VALID_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (producto) {
            setFormData({
                name: producto.name || '',
                price: producto.price?.toString() || '',
                category: producto.product_category?.slug || '',
                gender: producto.gender || '',
                clothing_type: producto.clothing_type || '',
                description: producto.description || '',
                color: Array.isArray(producto.color) ? producto.color : (producto.color ? [producto.color] : []),
                size: Array.isArray(producto.size) ? producto.size : (producto.size ? [producto.size] : []),
                slug: producto.slug || '',
            });


        }
    }, [producto]);

    if (!isOpen || !mounted || !producto) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(producto.documentId, {
                name: formData.name,
                price: parseFloat(formData.price),
                gender: formData.gender,
                clothing_type: formData.clothing_type,
                description: formData.description,
                color: formData.color,
                size: formData.size,
                slug: formData.slug,
            });
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // remove non-word chars (except spaces and hyphens)
            .replace(/\s+/g, '-')     // replace spaces with hyphens
            .replace(/-+/g, '-');     // remove multiple consecutive hyphens
    };


    const handleAddTag = (field: 'color' | 'size', value: string) => {
        if (!value.trim()) return;

        const cleanValue = value.trim().toUpperCase();

        if (field === 'size') {
            if (!VALID_SIZES.includes(cleanValue)) {
                setSizeError(true);
                setIsPulsing(true);
                setTimeout(() => setIsPulsing(false), 2000);
                return;
            }
            // Verificamos si la talla ya existe en el estado actual
            if (formData.size.some(s => s.toUpperCase() === cleanValue)) return;

            setSizeError(false);
            setIsPulsing(false);
        } else {
            // Para colores, verificar duplicados de forma insensible a mayúsculas en el estado actual
            const colorExists = formData.color.some(c => c.toLowerCase() === value.trim().toLowerCase());
            if (colorExists) return;
        }

        const limit = field === 'color' ? 10 : 5;
        if (formData[field].length >= limit) return;

        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], field === 'size' ? cleanValue : value.trim()]
        }));
    };

    const handleRemoveTag = (field: 'color' | 'size', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };



    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            {/* Backdrop with enhanced blur and dark overlay */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal with premium glassmorphism effect */}
            <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] shadow-blue-500/10 animate-in fade-in zoom-in-95 duration-300 backdrop-blur-xl">

                {/* Header Section - Fixed */}
                <div className="p-8 pb-4 flex items-center justify-between">

                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-inner">
                            <Package className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
                                Editar Producto
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-slate-400 font-medium">Actualiza tu inventario</p>
                                <span className="text-[10px] text-slate-600 font-bold">•</span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                                    <Tag size={10} />
                                    {formData.category || 'Sin categoría'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-100 hover:bg-slate-800/80 transition-all duration-200 active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
                        <div className="space-y-8 pt-4">
                            {/* Section: Basic Info */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <Input
                                        label="Nombre del Producto"
                                        value={formData.name}
                                        onChange={(e) => {
                                            const newName = e.target.value;
                                            setFormData({
                                                ...formData,
                                                name: newName,
                                                slug: generateSlug(newName)
                                            });
                                        }}
                                        placeholder="Ej: Camiseta Urban Oversize"
                                        rightElement={<Package className="w-4 h-4 text-blue-400/60" />}
                                        className="bg-slate-950/40 border-slate-800/60 focus:border-blue-500/50 transition-all duration-300"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Precio"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        rightElement={<DollarSign className="w-4 h-4 text-emerald-400/60" />}
                                        className="bg-slate-950/40 border-slate-800/60 focus:border-blue-500/50 transition-all duration-300"
                                    />
                                    <Select
                                        label="Género"
                                        value={formData.gender}
                                        onChange={(value) => setFormData({ ...formData, gender: value })}
                                        options={[
                                            { value: "Masculino", label: "Masculino" },
                                            { value: "Femenino", label: "Femenino" },
                                            { value: "Unisex", label: "Unisex" }
                                        ]}
                                        rightElement={<VenusAndMars className="w-4 h-4 text-purple-400/60" />}
                                        className="bg-slate-950/40 border-slate-800/60"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <Input
                                        label="Tipo de Prenda"
                                        value={formData.clothing_type}
                                        onChange={(e) => setFormData({ ...formData, clothing_type: e.target.value })}
                                        placeholder="Ej: Oversize, Slim Fit"
                                        rightElement={<Type className="w-4 h-4 text-purple-400/60" />}
                                        className="bg-slate-950/40 border-slate-800/60 focus:border-blue-500/50 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Section: Description */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs md:text-sm font-semibold text-slate-300">Descripción del Producto</label>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950/50 ${formData.description.length >= 140 ? 'text-red-400 border border-red-500/20' : 'text-slate-500 border border-slate-800/50'}`}>
                                        {formData.description.length} / 140
                                    </span>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300">
                                        <AlignLeft size={18} />
                                    </div>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 140) {
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                        }}
                                        maxLength={140}
                                        placeholder="Describe las características principales..."
                                        rows={3}
                                        className="w-full bg-slate-950/40 border border-slate-800/60 rounded-2xl py-3.5 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 shadow-inner transition-all duration-300 resize-none font-sans text-sm leading-relaxed"
                                    />
                                </div>
                            </div>

                            {/* Section: Variants (Colors & Sizes) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-slate-950/20 border border-slate-800/40">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Palette size={14} className="text-blue-400" />
                                            Colores
                                        </label>
                                        <span className={`text-[10px] font-mono ${formData.color.length >= 10 ? 'text-red-400' : 'text-slate-500'}`}>
                                            {formData.color.length}/10
                                        </span>
                                    </div>
                                    <div className="min-h-[40px] flex flex-wrap gap-2 p-1">
                                        {formData.color.map((tag, i) => (
                                            <span key={i} className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-1 duration-300 hover:bg-blue-500/20 transition-all cursor-default">
                                                {tag}
                                                <button type="button" onClick={() => handleRemoveTag('color', i)} className="text-blue-500/50 hover:text-blue-300 transition-colors">
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </span>
                                        ))}
                                        {formData.color.length === 0 && <p className="text-[10px] text-slate-600 italic py-1">Sin colores definidos</p>}
                                    </div>
                                    <Input
                                        placeholder={formData.color.length >= 10 ? "Límite alcanzado" : "Escribir color..."}
                                        disabled={formData.color.length >= 10}
                                        onKeyDown={(e: any) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag('color', e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        className={`bg-slate-950/60 border-slate-800/80 h-10 text-xs focus:border-blue-500/40 ${formData.color.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Ruler size={14} className="text-purple-400" />
                                            Tallas
                                        </label>
                                        <span className={`text-[10px] font-mono ${formData.size.length >= 5 ? 'text-red-400' : 'text-slate-500'}`}>
                                            {formData.size.length}/5
                                        </span>
                                    </div>
                                    <div className="min-h-[40px] flex flex-wrap gap-2 p-1">
                                        {formData.size.map((tag, i) => (
                                            <span key={i} className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-1 duration-300 hover:bg-purple-500/20 transition-all cursor-default">
                                                {tag}
                                                <button type="button" onClick={() => handleRemoveTag('size', i)} className="text-purple-500/50 hover:text-purple-300 transition-colors">
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </span>
                                        ))}
                                        {formData.size.length === 0 && <p className="text-[10px] text-slate-600 italic py-1">Sin tallas definidas</p>}
                                    </div>
                                    <Input
                                        placeholder={formData.size.length >= 5 ? "Límite alcanzado" : (sizeError ? "Talla no válida" : "Ej: S, M, L...")}
                                        disabled={formData.size.length >= 5}
                                        error={sizeError ? "Talla no válida" : undefined}
                                        onKeyDown={(e: any) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag('size', e.target.value);
                                                if (!VALID_SIZES.includes(e.target.value.trim().toUpperCase())) {
                                                    // keep value to show what's wrong or clear it
                                                } else {
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                        onChange={() => sizeError && setSizeError(false)}
                                        className={`bg-slate-950/60 border-slate-800/80 h-10 text-xs focus:border-purple-500/40 ${formData.size.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''} ${sizeError ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                    />
                                    {sizeError && (
                                        <p className={`text-[9px] text-red-400 font-bold uppercase tracking-tight ml-1 ${isPulsing ? 'animate-pulse' : ''}`}>
                                            Solo permitido: S, M, L, XL, XXL
                                        </p>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Action Buttons - Fixed at bottom */}
                    <div className="p-8 pt-4 flex items-center justify-end gap-4 border-t border-slate-800/60 bg-slate-900/50 backdrop-blur-sm rounded-b-3xl">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                            className="flex-1 py-4 text-sm font-bold"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-4 text-sm font-bold whitespace-nowrap"
                        >
                            <div className='flex items-center justify-center'>
                                {isSubmitting ? (
                                    <Loader2 size={20} className="mr-2 animate-spin text-blue-100" />
                                ) : (
                                    <Save size={20} className="text-blue-100 mr-2" />
                                )}
                                <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
                            </div>
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
