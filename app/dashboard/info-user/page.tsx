'use client'
import { useUser } from "@/components/Context/contextInfoUser"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { User, Mail, Edit2, Save, X } from "lucide-react"
import { useState, useEffect } from "react"

export default function InfoUser() {
    const { user, setUser } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    })

    // Update form data when user context availability changes or when entering edit mode
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || ''
            })
        }
    }, [user])

    const handleSave = () => {
        setUser({
            username: formData.username,
            email: formData.email
        })
        setIsEditing(false)
    }

    const handleCancel = () => {
        setFormData({
            username: user.username || '',
            email: user.email || ''
        })
        setIsEditing(false)
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
        <div className="max-w-4xl h-full p-6 mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Perfil de Usuario</h1>
                    <p className="text-slate-400">Gestiona tu información personal</p>
                </div>
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="secondary"
                        icon={<Edit2 size={18} />}
                    >
                        Editar Información
                    </Button>
                )}
            </div>

            <div className="grid gap-6">
                <Card title="Información Personal" icon={<User size={32} />}>
                    <div className="space-y-6">
                        {isEditing ? (
                            <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Input
                                        label="Nombre de Usuario"
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        rightElement={<User size={16} className="text-slate-500" />}
                                    />
                                    <Input
                                        label="Correo Electrónico"
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        rightElement={<Mail size={16} className="text-slate-500" />}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-800">
                                    <Button
                                        variant="ghost"
                                        onClick={handleCancel}
                                        icon={<X size={18} />}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                        icon={<Save size={18} />}
                                    >
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800/50">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                                        Nombre de Usuario
                                    </label>
                                    <div className="flex items-center gap-3 text-lg font-medium text-slate-200">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                            <User size={20} />
                                        </div>
                                        {user.username || 'No definido'}
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800/50">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                                        Correo Electrónico
                                    </label>
                                    <div className="flex items-center gap-3 text-lg font-medium text-slate-200">
                                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                            <Mail size={20} />
                                        </div>
                                        {user.email || 'No definido'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}