'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { HOST_SERVER } from '@/app/const';
import { Message } from '@/types';

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversationId: string | null;
    conversationTitle?: string;
}

interface GalleryImage {
    url: string;
    messageIndex: number;
    contentIndex: number;
}

export const GalleryModal = ({ isOpen, onClose, conversationId, conversationTitle }: GalleryModalProps) => {
    const [mounted, setMounted] = useState(false);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen && conversationId) {
            fetchImages();
        } else {
            setImages([]);
            setLoading(true);
            setSelectedImageIndex(null);
        }
    }, [isOpen, conversationId]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${HOST_SERVER}/dashboard/conversation?id=${conversationId}`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                const extractedImages: GalleryImage[] = [];

                (data.messages || []).forEach((msg: Message, msgIdx: number) => {
                    msg.content.forEach((item, itemIdx) => {
                        if (item.type === 'input_image' && item.image_url) {
                            extractedImages.push({
                                url: item.image_url,
                                messageIndex: msgIdx,
                                contentIndex: itemIdx
                            });
                        }
                    });
                });

                setImages(extractedImages);
            }
        } catch (error) {
            console.error("Error fetching images for gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (url: string, index: number) => {
        try {
            // Deshabilitar propagación si viene de un evento
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = `image-${conversationId}-${index}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Limpiar memoria
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Error downloading image:", error);
            // Fallback para abrir en nueva pestaña si falla la descarga
            window.open(url, '_blank');
        }
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % images.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
        }
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300`}>
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                            <ImageIcon className="text-blue-500" size={24} />
                            Galería de Imágenes
                        </h2>
                        {conversationTitle && (
                            <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                                {conversationTitle}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-all active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="aspect-square bg-slate-800/50 rounded-2xl animate-pulse border border-slate-800/50" />
                            ))}
                        </div>
                    ) : images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="group relative aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/10"
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <img
                                        src={img.url}
                                        alt={`Imagen ${index}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await handleDownload(img.url, index);
                                            }}
                                            className=" p-2 bg-slate-900/90 rounded-lg text-slate-200 hover:bg-blue-600 transition-colors shadow-lg"
                                            title="Descargar"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                                <ImageIcon size={32} className="text-slate-600" />
                            </div>
                            <p className="text-lg">No hay imágenes en esta conversación</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox / Slider overlay */}
            {selectedImageIndex !== null && (
                <div
                    className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-lg flex items-center justify-center animate-in fade-in duration-300 cursor-zoom-out"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all z-10 active:scale-95 shadow-xl cursor-pointer"
                        onClick={() => setSelectedImageIndex(null)}
                    >
                        <X size={24} />
                    </button>

                    {/* Download button */}
                    <button
                        className="absolute top-4 right-16 md:top-6 md:right-20 p-3 rounded-full bg-blue-600/90 backdrop-blur-sm text-white hover:bg-blue-500 transition-all z-10 active:scale-95 shadow-xl cursor-pointer"
                        onClick={async (e) => {
                            e.stopPropagation();
                            await handleDownload(images[selectedImageIndex].url, selectedImageIndex);
                        }}
                        title="Descargar imagen"
                    >
                        <Download size={24} />
                    </button>

                    {/* Previous button */}
                    <button
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all z-10 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 shadow-xl cursor-pointer"
                        onClick={prevImage}
                        disabled={images.length <= 1}
                    >
                        <ChevronLeft size={32} />
                    </button>

                    {/* Image container */}
                    <div
                        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[selectedImageIndex].url}
                            alt={`Imagen ${selectedImageIndex}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        />
                    </div>

                    {/* Next button */}
                    <button
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all z-10 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 shadow-xl cursor-pointer"
                        onClick={nextImage}
                        disabled={images.length <= 1}
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Image counter */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 backdrop-blur-sm rounded-full text-slate-300 text-sm font-medium shadow-xl border border-slate-700/50">
                        {selectedImageIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};
