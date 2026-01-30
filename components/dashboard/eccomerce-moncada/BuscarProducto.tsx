import { isServerImage } from "@/app/const"
import { useDebounce } from "@/components/hooks/useDebounce"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { DropdownMenu } from "@/components/ui/DropdownMenu"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { tform } from "@/types"
import { Loader2, Filter, ChevronUp, ChevronDown, RotateCcw, DollarSign, ShoppingBag, Package, Tag, Edit, Trash2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import AIInputSection from "@/components/dashboard/AIInputSection"
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { EditProductModal } from "@/components/dashboard/EditProductModal";
import { useTienda } from "@/components/context/contextInfoTienda"

function useFiltroDropdown() {
    // efecto de mostrar y ocultar filtros
    const [showFilters, setShowFilters] = useState(false)
    const [isFiltersFullyOpen, setIsFiltersFullyOpen] = useState(false)

    useEffect(() => {
        if (showFilters) {
            const timer = setTimeout(() => setIsFiltersFullyOpen(true), 300)
            return () => clearTimeout(timer)
        } else {
            setIsFiltersFullyOpen(false)
        }
    }, [showFilters])

    return { showFilters, isFiltersFullyOpen, setShowFilters }
}

export default function BuscarProducto({ setStateToast }: {
    setStateToast: ({ message, variant }: { message: string, variant: "success" | "error" | "info" | "loading" }) => void,
}) {

    const { opciones } = useTienda()
    const { showFilters, isFiltersFullyOpen, setShowFilters } = useFiltroDropdown()

    // eliminar

    const [isOpenModalEliminar, setIsOpenModalEliminar] = useState(false)
    const [idEliminar, setIdEliminar] = useState<number | null>(null)

    const handleOpenModalEliminar = ({ id }: { id: number }) => {
        setIdEliminar(id)
        setIsOpenModalEliminar(true)
    }

    const handleCloseModalEliminar = () => {
        setIsOpenModalEliminar(false)
    }

    const handleEliminar = () => {
        if (!idEliminar) return

        // logica para eliminar el
        setIsOpenModalEliminar(false)
        // console.log(idEliminar)
        // return
        fetch("/api/eliminar-producto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idEliminar }),
        })
            .then(res => res.json() as Promise<{ message: string }>)
            .then(({ message }) => {
                setStateToast({ message, variant: "success" })
            })
            .catch(err => {
                setStateToast({ message: "Error al eliminar el producto", variant: "error" })
            })
    }

    // editar

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [productToEdit, setProductToEdit] = useState<any>(null)

    const handleOpenEditModal = (producto: any) => {
        setProductToEdit(producto)
        setIsEditModalOpen(true)
    }

    const handleSaveProduct = async (id: number, data: any) => {
        try {
            const res = await fetch("/api/editar-producto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, data }),
            });
            const { message } = await (res.json() as Promise<{ message: string; }>);
            setStateToast({ message, variant: "success" });
            setIsEditModalOpen(false);
        } catch (err) {
            setStateToast({ message: "Error al actualizar el producto", variant: "error" });
            throw err;
        }
    }

    // formulario de busqueda 

    const [stateProductos, setStateProductos] = useState({
        productos: [],
        loading: false
    })

    const [formProductos, setFormProductos] = useState<tform>({
        name: "",
        categoria: "",
        genero: "",
        clothing_type: "",
        price_min: 0,
        price_max: 0,
        sort: ""
    })

    const verificarForm = ({ form }: { form: tform }) => {

        return form.name !== "" || form.categoria !== "" || form.genero !== "" || form.clothing_type !== "" || form.price_min !== 0 || form.price_max !== 0 || form.sort !== ""
    }

    const resetFormProductos = () => {
        setFormProductos({
            name: "",
            categoria: "",
            genero: "",
            clothing_type: "",
            price_min: 0,
            price_max: 0,
            sort: ""
        })
        setStateProductos(prev => ({ ...prev, productos: [] }))
    }

    const sendFormProductos = ({ form }: { form: tform }) => {
        const { name, categoria, genero, clothing_type } = form
        setStateProductos(prev => ({ ...prev, loading: true }))
        fetch("/api/buscar-productos", {
            method: "POST",
            body: JSON.stringify({
                nameProducto: name,
                categoria,
                genero,
                clothing_type,
                price_min: form.price_min,
                price_max: form.price_max,
                sort: form.sort
            })
        })
            .then(res => res.json() as Promise<{ productosEncontrados: any[] }>)
            .then(({ productosEncontrados }) => {
                setStateProductos(prev => ({ ...prev, productos: productosEncontrados as any, loading: false }))
            })
        // .finally(() => (false))
    }
    const debouncedSearchProductos = useDebounce(() => sendFormProductos({ form: formProductos }), 200)

    const anteriorName = useRef(formProductos.name)
    useEffect(() => {
        if (!verificarForm({ form: formProductos })) return

        const actualName = formProductos.name
        if (actualName !== anteriorName.current) {
            debouncedSearchProductos()
            anteriorName.current = actualName
            return
        }
        sendFormProductos({ form: formProductos })

    }, [formProductos])

    return (
        <>
            <ConfirmationModal
                isOpen={isOpenModalEliminar}
                title="Eliminar producto"
                message="¿Estas seguro de eliminar este producto?"
                onClose={handleCloseModalEliminar}
                onConfirm={handleEliminar}
            />
            <EditProductModal
                isOpen={isEditModalOpen}
                producto={productToEdit}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveProduct}
            />

            <Card
                title="Encuentra productos con IA"
                description="Filtra los productos manualmente o con IA por nombre, categoría o género."
                className="p-2"
            >
                {/* Resultados de búsqueda con animación */}
                <ProductResults
                    handleOpenModalEliminar={handleOpenModalEliminar}
                    handleOpenEditModal={handleOpenEditModal}
                    productos={stateProductos?.productos}
                />

                <form className="grid grid-cols-1 gap-6">


                    {/* Search Section */}
                    <section className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <Input
                                value={formProductos.name}
                                onChange={(e) => setFormProductos({ ...formProductos, name: e.target.value })}
                                label="Nombre del producto"
                                type="text"
                                name="nombre"
                                id="search-nombre"
                                placeholder="Ej: Camiseta Oversize..."
                            />
                        </div>
                        <div className="flex gap-4 w-full md:w-auto md:h-13">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:py-0 rounded-2xl border transition-all duration-300 ${showFilters
                                    ? "bg-blue-600/10 border-blue-500/50 text-blue-400"
                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                                    }`}
                            >
                                {
                                    stateProductos.loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Filter className="w-4 h-4" />

                                    )
                                }
                                <span className="text-sm font-bold">Filtros</span>
                                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <Button type="reset" onClick={resetFormProductos}>
                                <div className="flex items-center">
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Resetear
                                </div>
                            </Button>

                        </div>
                    </section>

                    <div className={`grid transition-all duration-300 ease-in-out ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className={isFiltersFullyOpen ? 'overflow-visible' : 'overflow-hidden'}>
                            <div className="flex flex-col gap-6 pt-4">
                                <div className="border-t border-slate-800/10 mb-2"></div>
                                {/* Filters Section */}
                                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Select
                                        label="Categoria"
                                        name="categoria"
                                        id="search-categoria"
                                        placeholder="Todos"
                                        value={formProductos.categoria}
                                        onChange={(value) => setFormProductos({ ...formProductos, categoria: value })}
                                        options={opciones.categorias}
                                    />
                                    <Select
                                        label="Tipo de ropa"
                                        name="clothing_type"
                                        id="search-clothing_type"
                                        placeholder="Todos"
                                        value={formProductos.clothing_type}
                                        onChange={(value) => setFormProductos({ ...formProductos, clothing_type: value })}
                                        options={opciones.clothingType}
                                    />
                                    <Select
                                        label="Genero"
                                        name="genero"
                                        id="search-genero"
                                        placeholder="Todos"
                                        value={formProductos.genero}
                                        onChange={(value) => setFormProductos({ ...formProductos, genero: value })}
                                        options={opciones.genero}
                                    />
                                </section>

                                {/* Price and Sort Section */}
                                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        label="Precio Mínimo"
                                        type="number"
                                        name="min_price"
                                        id="search-min-price"
                                        placeholder="0.00"
                                        value={formProductos.price_min}
                                        onChange={(e) => setFormProductos({ ...formProductos, price_min: Number(e.target.value) })}
                                        rightElement={<DollarSign className="w-4 h-4 text-slate-500" />}
                                    />
                                    <Input
                                        label="Precio Máximo"
                                        type="number"
                                        name="max_price"
                                        id="search-max-price"
                                        placeholder="1000.00"
                                        value={formProductos.price_max}
                                        onChange={(e) => setFormProductos({ ...formProductos, price_max: Number(e.target.value) })}
                                        rightElement={<DollarSign className="w-4 h-4 text-slate-500" />}
                                    />
                                    <Select
                                        label="Ordenar por"
                                        name="sort"
                                        id="search-sort"
                                        placeholder="Relevancia"
                                        value={formProductos.sort}
                                        onChange={(value) => setFormProductos({ ...formProductos, sort: value as "" | "price_asc" | "price_desc" | "newest" })}
                                        options={[
                                            // { value: "relevance", label: "Relevancia" },
                                            { value: "price_asc", label: "Precio: Menor a Mayor" },
                                            { value: "price_desc", label: "Precio: Mayor a Menor" },
                                            { value: "newest", label: "Más recientes" }
                                        ]}
                                    />
                                </section>
                            </div>
                        </div>
                    </div>

                </form>

                <div className="mt-6 pt-6 border-t border-slate-800/50">
                    <AIInputSection
                        setStateToast={setStateToast}
                        handleAyudaIa={setFormProductos} />
                </div>
            </Card>
        </>

    )
}

function ProductResults({ productos, handleOpenModalEliminar, handleOpenEditModal }: {
    productos: any[],
    handleOpenModalEliminar: ({ id }: { id: number }) => void,
    handleOpenEditModal: (producto: any) => void
}) {

    return (
        <div className={`grid transition-all duration-500 ease-in-out ${productos?.length > 0 ? 'grid-rows-[1fr] opacity-100 mb-6 mt-2' : 'grid-rows-[0fr] opacity-0 mb-0 mt-0 pointer-events-none'}`}>
            <div className="overflow-hidden">
                <section className="w-full bg-slate-950/40 border border-slate-800/50 rounded-2xl backdrop-blur-sm shadow-xl overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-800/30 bg-slate-900/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Productos Encontrados</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {productos?.length} items
                        </span>
                    </div>
                    <div className="overflow-y-auto min-h-30 max-h-100 custom-scrollbar">
                        <div className="p-2 grid grid-cols-1 gap-2">
                            {productos?.map((producto: any) => (
                                <ProductCard
                                    key={producto.id}
                                    producto={producto}
                                    handleOpenModalEliminar={handleOpenModalEliminar}
                                    handleOpenEditModal={handleOpenEditModal}
                                />
                            ))}
                        </div>

                    </div>
                </section>
            </div>
        </div>
    )
}

function ProductCard({ producto, handleOpenModalEliminar, handleOpenEditModal }: {
    producto: any,
    handleOpenModalEliminar: ({ id }: { id: number }) => void,
    handleOpenEditModal: (producto: any) => void
}) {
    return (
        <div
            className="group flex items-center gap-4 p-3 rounded-xl bg-slate-900/30 border border-slate-800/30 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200"
        >
            <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center border border-slate-700/50 group-hover:scale-105 transition-transform duration-200">
                {
                    producto.images
                        ? (
                            <img src={
                                `${isServerImage}${producto.images[0].url}`

                            } className="w-full h-full object-cover rounded-lg" />
                        )
                        : (
                            <Package className="w-6 h-6 text-slate-500" />
                        )
                }
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                    {producto.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {producto.product_category.slug || 'Sin categoría'}
                    </span>
                    <span className="text-[10px] text-slate-600">•</span>
                    <span className="text-xs font-mono text-blue-400/80">
                        ${producto.price || '0.00'}
                    </span>
                </div>
            </div>

            <DropdownMenu
                trigger={
                    <button
                        className="p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white"
                    >
                        <ChevronUp className="w-4 h-4 rotate-90" />
                    </button>
                }
                items={[
                    {
                        label: "Editar Producto",
                        icon: <Edit size={20} />,
                        onClick: () => handleOpenEditModal(producto)
                    },

                    {
                        label: "Eliminar Registro",
                        icon: <Trash2 size={20} />,
                        variant: "danger",
                        onClick: () => handleOpenModalEliminar({ id: producto.documentId })
                    }
                ]}
            />
        </div>
    )
}
