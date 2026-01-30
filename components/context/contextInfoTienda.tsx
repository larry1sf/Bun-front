"use client"

import { optionsFilters } from "@/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type numeroProps = {
    count: number | null
    error: boolean
}
interface tiendaCreateContext {
    numeroStateProductos: numeroProps
    opciones: optionsFilters
    getNumeroProductos: () => void
    getFilters: () => void
}

const TiendaContext = createContext<tiendaCreateContext | undefined>(undefined)

export const TiendaProvider = ({ children }: { children: React.ReactNode }) => {
    const [numeroStateProductos, setNumeroStateProductos] = useState<numeroProps>({
        count: null,
        error: false
    })
    const [opciones, setOpciones] = useState<optionsFilters>(() => {
        if (typeof window !== "undefined") {
            const opciones = localStorage.getItem("opcionesFiltros")
            if (opciones) {
                return JSON.parse(opciones) as optionsFilters
            }
        }
        return {
            clothingType: [{ value: "todos", label: "Todos" }],
            categorias: [{ value: "todos", label: "Todos" }],
            genero: [
                { value: "todos", label: "Todos" },
                { value: "hombre", label: "Hombre" },
                { value: "mujer", label: "Mujer" },
                { value: "unisex", label: "Unisex" }
            ]
        }
    })

    useEffect(() => {
        if (numeroStateProductos.error) return
        getNumeroProductos()
    }, [])

    // buscar el numero de productos publicados
    const getNumeroProductos = useCallback(() => {
        fetch("/api/numero-productos")
            .then(res => {
                return res.json() as Promise<{ numeroProductos: number | null }>
            })
            .then(({ numeroProductos }) => {
                setNumeroStateProductos({
                    count: numeroProductos,
                    error: typeof numeroProductos !== 'number'
                })
            })

    }, [])

    // busca las opciones para los filtros 
    const getFilters = useCallback(() => {
        fetch("/api/buscar-opciones")
            .then(res => res.json() as Promise<{ opciones: any }>)
            .then(({ opciones }) => {
                const ct = opciones.map((item: any) => ({ value: item.clothing_type, label: item.clothing_type }))
                const g = opciones.map((item: any) => ({ value: item.gender, label: item.gender }))
                const c = opciones.map((item: any) => ({ value: item.product_category.slug, label: item.product_category.title }))
                const newOpciones = {
                    clothingType: [{ value: "todos", label: "Todos" }, ...ct],
                    categorias: [{ value: "todos", label: "Todos" }, ...c],
                    genero: [{ value: "todos", label: "Todos" }, ...g]
                }
                return newOpciones
            })
            .then((newOpciones) => {
                setOpciones(newOpciones)
                localStorage.setItem("opcionesFiltros", JSON.stringify(newOpciones))
            })
            .catch(err => {
                console.error("Error al obtener las opciones de los filtros", err)
            })
    }, [])

    return (
        <TiendaContext.Provider value={{
            opciones,
            numeroStateProductos,
            getFilters,
            getNumeroProductos
        }}>
            {children}
        </TiendaContext.Provider>
    )
}

export const useTienda = () => {
    const context = useContext(TiendaContext)
    if (context === undefined) throw new Error('useTienda solo se puede usar deltrodel TiendaProvider')

    return context
}