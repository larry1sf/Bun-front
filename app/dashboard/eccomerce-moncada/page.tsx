"use client"

import { Toast } from "@/app/components/Toast";
import { Card } from "@/components/ui/Card";
import { useState } from "react";

import BuscarProducto from "@/components/dashboard/eccomerce-moncada/BuscarProducto";
import AgregarProducto from "@/components/dashboard/eccomerce-moncada/AgregarProducto";
import { useTienda } from "@/components/context/contextInfoTienda";


export default function Page() {
    type tvista = "" | "agregar" | "buscar"
    const [vistaTienda, setVistaTienda] = useState<tvista>("buscar")
    const { numeroProductos } = useTienda()

    const handleAgregar = () => {
        setVistaTienda("agregar")
    }
    const handleBuscar = () => {
        setVistaTienda("buscar")

    }

    // toast
    const [stateToast, setStateToast] = useState({
        message: "",
        variant: "info" as "success" | "error" | "info" | "loading",
    })

    const handleToast = ({ message, variant }: { message: string, variant: "success" | "error" | "info" | "loading" }) => {
        setStateToast({ message, variant })
    }

    return (
        <div className="p-6 flex flex-col gap-6 overflow-auto">
            {
                stateToast.message && (
                    <Toast
                        message={stateToast.message}
                        variant={stateToast.variant}
                        onClose={() => setStateToast({ message: "", variant: "info" })}
                    />
                )
            }
            <header className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

                <Card
                    title="Agregar productos"
                    description="Crea una vista del nuevo producto en unos pasos simples"
                    className="p-2 flex flex-col items-center justify-center">
                    <button
                        onClick={handleAgregar}
                        className="transition duration-200 shadow-lg bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40 text-white px-4 py-2 rounded-lg active:scale-95">
                        Agregar
                    </button>
                </Card>
                <Card
                    title="Numero de productos"
                    description="Es una manera de ver cuantos productos tienes en la tienda"
                    className="p-2">
                    <p className="text-3xl text-center font-bold text-slate-200">
                        {numeroProductos}
                    </p>
                </Card>
                <Card
                    title="Buscar productos"
                    description="Busca un producto facilmente por su nombre o referencia"
                    className="p-2 flex flex-col items-center justify-center">

                    <button
                        onClick={handleBuscar}
                        className="transition duration-200 shadow-lg bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40 text-white px-4 py-2 rounded-lg active:scale-95">
                        Buscar
                    </button>

                </Card>
            </header>

            {vistaTienda === "agregar" && <AgregarProducto setStateToast={handleToast} />}
            {vistaTienda === "buscar" && <BuscarProducto setStateToast={handleToast}
            />}


        </div>
    )
}
