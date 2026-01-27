'use client'
import { useUser } from "@/components/Context/contextInfoUser"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { User, Mail, Edit2, Save, X, Key, AlertCircle, Camera, Shield, ArrowLeft, Loader } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import Link from "next/link"
import Spinner from "@/components/Spinner"

export default function InfoUser() {
    const { user, setUser } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        id: -1,
        securityPhrase: '',
        image: '' as string | null
    })
    const [errors, setErrors] = useState<{ username?: string; email?: string; general?: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Update form data when user context availability changes or when entering edit mode
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                id: user.id || -1,
                securityPhrase: user.securityPhrase || '',
                image: user.image || null
            })
        }
    }, [user])

    const validate = () => {
        const newErrors: { username?: string; email?: string } = {}

        // Username validation: alphanumeric, max 15 chars
        if (!formData.username.trim()) {
            newErrors.username = "El nombre de usuario es requerido"
        } else if (formData.username.length > 15) {
            newErrors.username = "Máximo 15 caracteres"
        } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.username)) {
            newErrors.username = "Solo se permiten letras, números y espacios"
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "El correo es requerido"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Correo electrónico inválido"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleUpdateUser = async () => {
        try {
            const res = await fetch('/api/update-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    id: formData.id,
                    token: formData.securityPhrase === '' ? user?.securityPhrase : formData.securityPhrase,
                    image: formData.image
                })
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 409) {
                    setErrors(prev => ({ ...prev, email: data.message }))
                } else {
                    setErrors(prev => ({ ...prev, general: data.message || "Error al guardar los cambios" }))
                }
                return false
            }

            return true
        } catch (error) {
            console.log(error)
            setErrors(prev => ({ ...prev, general: "Error de conexión" }))
            return false
        }
    }

    const handleSave = async () => {
        if (!validate()) return

        setIsLoading(true)
        const success = await handleUpdateUser()
        setIsLoading(false)

        if (success) {
            setUser({
                username: formData.username,
                email: formData.email,
                id: formData.id,
                securityPhrase: formData.securityPhrase === '' ? user?.securityPhrase || '' : formData.securityPhrase,
                image: formData.image
            })
            console.log("Guardado en la bd real")
            setIsEditing(false)
            setErrors({})
        }
    }

    const handleCancel = () => {
        setFormData({
            username: user.username || '',
            email: user.email || '',
            id: user.id || -1,
            securityPhrase: user.securityPhrase || '',
            image: user.image || null
        })
        setErrors({})
        setIsEditing(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center p-10">
                <Card className="w-full max-w-md text-center">
                    <p className="text-slate-400">Usuario no acordado en el contexto</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-6xl size-full p-4 sm:p-6 mx-auto space-y-6 sm:space-y-8 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/50 pb-6 gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link href="/dashboard" className="btn-secondary h-10 w-10 flex items-center justify-center p-0">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">Perfil</h1>
                        <p className="text-slate-400 text-xs sm:text-sm">Gestiona tu identidad y seguridad</p>
                    </div>
                </div>
                {isEditing ? (
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            icon={<X size={16} />}
                            className="text-xs sm:text-sm flex-1 sm:flex-none"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            icon={isLoading ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                            className="text-xs sm:text-sm flex-1 sm:flex-none"
                            disabled={isLoading}
                        >
                            {isLoading ? '...' : 'Guardar'}
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={() => {
                            setIsEditing(true)
                            setFormData(prev => ({ ...prev, securityPhrase: '' }))
                        }}
                        variant="secondary"
                        icon={<Edit2 size={16} />}
                        className="text-xs sm:text-sm w-full sm:w-auto"
                    >
                        Editar
                    </Button>
                )}
            </div>

            {
                isLoading ? (
                    <div className="absolute top-0 size-fit left-0 right-0 bottom-0 m-auto">
                        <Spinner />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Left Column: User Image and Quick Stats/Status */}
                        <div className="md:col-span-4 lg:col-span-3 space-y-6">
                            <Card className="p-6 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
                                <div className="relative group">
                                    <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden shadow-2xl relative ${isEditing ? 'cursor-pointer hover:border-slate-700' : ''}`}>
                                        {formData.image ? (
                                            <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={40} className="text-slate-600 sm:w-12 sm:h-12" />
                                        )}

                                        {isEditing && (
                                            <div
                                                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Camera size={24} className="mb-1" />
                                                <span className="text-[10px] uppercase font-bold tracking-wider">Cambiar</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-white">{formData.username || 'Usuario'}</h2>
                                    <p className="text-sm text-slate-500">{formData.email || 'Sin correo'}</p>
                                </div>

                                {!isEditing && (
                                    <div className="w-full pt-4 border-t border-slate-800/50">
                                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">Estado</div>
                                        {
                                            user.securityPhrase?.length ? (<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                Verificado
                                            </div>) : (<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500/70 text-xs font-bold uppercase text-nowrap">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70 animate-pulse" />
                                                Sin verificar
                                            </div>)
                                        }
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Right Column: Detailed Info */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-6">
                            <Card className="overflow-hidden">
                                {/* Personal Information Section */}
                                <div className="p-5 sm:p-8 border-b border-slate-800/50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="hidden sm:block p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                            <User size={24} />
                                        </div>
                                        <div className="sm:hidden p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Información Personal</h3>
                                            <p className="text-xs sm:text-sm text-slate-400">Explora y actualiza tus datos</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {isEditing ? (
                                            <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <div className="space-y-2">
                                                    <Input
                                                        label="Nombre de Usuario"
                                                        id="username"
                                                        value={formData.username}
                                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                        rightElement={<User size={16} className="text-slate-500" />}
                                                        maxLength={15}
                                                        helperText="Máximo 15 caracteres"
                                                    />
                                                    {errors.username && (
                                                        <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
                                                            <AlertCircle size={12} />
                                                            <span>{errors.username}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Input
                                                        label="Correo Electrónico"
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        rightElement={<Mail size={16} className="text-slate-500" />}
                                                    />
                                                    {errors.email && (
                                                        <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
                                                            <AlertCircle size={12} />
                                                            <span>{errors.email}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.general && (
                                                    <div className="md:col-span-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                                        <AlertCircle size={16} />
                                                        {errors.general}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <div className="group p-3 sm:p-4 rounded-xl bg-slate-950/30 border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                                                    <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 sm:mb-1.5 block">
                                                        Nombre de Usuario
                                                    </label>
                                                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-200">
                                                        {user.username || 'No definido'}
                                                    </div>
                                                </div>

                                                <div className="group p-3 sm:p-4 rounded-xl bg-slate-950/30 border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                                                    <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 sm:mb-1.5 block">
                                                        Correo Electrónico
                                                    </label>
                                                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-200 truncate pr-2" title={user.email ?? undefined}>
                                                        {user.email || 'No definido'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Security Section */}
                                <div className="p-5 sm:p-8 ">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="hidden sm:block p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                            <Shield size={24} />
                                        </div>
                                        <div className="sm:hidden p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Seguridad</h3>
                                            <p className="text-xs sm:text-sm text-slate-400">Protege tu cuenta adecuadamente</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {isEditing ? (
                                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <Input
                                                    label="Frase de Seguridad"
                                                    id="securityPhrase"
                                                    type="password"
                                                    placeholder={user.securityPhrase ? "Cambia tu frase de seguridad" : "Ingresa tu frase de seguridad"}
                                                    value={formData.securityPhrase}
                                                    onChange={(e) => setFormData({ ...formData, securityPhrase: e.target.value })}
                                                    rightElement={<Key size={16} className="text-slate-500" />}
                                                />
                                                <p className="mt-2 text-xs text-slate-500 italic">
                                                    Esta frase es vital para la recuperación de tu cuenta.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                {user.securityPhrase ? (
                                                    <div className="p-3 sm:p-4 rounded-xl bg-slate-950/30 border border-slate-800/50 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                                                        <div className="flex items-center gap-3 sm:gap-4">
                                                            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                                                <Key size={18} className="sm:w-5 sm:h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] sm:text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-0.5">Verificado</p>
                                                                <p className="text-xs sm:text-sm font-medium text-slate-200">Frase Configurada</p>
                                                            </div>
                                                        </div>
                                                        <div className="hidden sm:block text-xs text-slate-500">
                                                            **********
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3 sm:gap-4 w-full">
                                                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                                                                <AlertCircle size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] sm:text-xs font-bold text-amber-500/70 uppercase tracking-widest">Sin verificar</p>
                                                                <p className="text-xs sm:text-sm font-medium text-amber-50">Sin frase de seguridad</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => setIsEditing(true)}
                                                            className="w-full sm:w-auto text-[10px] sm:text-xs py-1 h-8 bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30"
                                                        >
                                                            Configurar
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )
            }
        </div>
    )
}