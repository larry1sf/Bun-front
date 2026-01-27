'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/Toast'
import Link from 'next/link'

type Step = 1 | 2 | 3

export default function ReStorePage() {
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [userIdentifier, setUserIdentifier] = useState('')
    const [storedTokenHash, setStoredTokenHash] = useState<string | null>(null)
    const [recoveryPhrase, setRecoveryPhrase] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'loading', text: string } | null>(null)
    const router = useRouter()

    // Paso 1: Verificar si el usuario existe y obtener su token
    const handleCheckUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/check-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: userIdentifier,
                    email: userIdentifier
                })
            })

            const data = await response.json()

            if (response.ok) {
                setStoredTokenHash(data.token)
                setMessage({ type: 'success', text: 'Usuario encontrado. Continúa al siguiente paso.' })
                setTimeout(() => {
                    setCurrentStep(2)
                    setMessage(null)
                }, 100)
            } else {
                setMessage({ type: 'error', text: data.message || 'Usuario no encontrado' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión con el servidor' })
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    // Paso 2: Verificar la frase de recuperación
    const handleVerifyPhrase = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/verify-phrase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    phrase: recoveryPhrase,
                    hashedPhrase: storedTokenHash
                })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Frase verificada correctamente.' })
                setTimeout(() => {
                    setCurrentStep(3)
                    setMessage(null)
                }, 100)
            } else {
                setMessage({ type: 'error', text: data.message || 'Frase de recuperación incorrecta' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión con el servidor' })
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    // Paso 3: Actualizar la contraseña
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
            return
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' })
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: userIdentifier,
                    email: userIdentifier,
                    newPassword: newPassword
                })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: data.message || 'Contraseña actualizada correctamente' })
                setTimeout(() => {
                    router.push('/login?passwordChanged=true')
                }, 300)
            } else {
                setMessage({ type: 'error', text: data.message || 'Error al actualizar la contraseña' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión con el servidor' })
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1)
            setRecoveryPhrase('')
        } else if (currentStep === 3) {
            setCurrentStep(2)
            setNewPassword('')
            setConfirmPassword('')
        }
        setMessage(null)
    }

    const stepConfig = {
        1: {
            title: "Recuperar Contraseña",
            description: "Ingresa tu usuario o correo para continuar",
            icon: "🔑"
        },
        2: {
            title: "Verificar Frase",
            description: "Ingresa tu frase de recuperación",
            icon: "🔐"
        },
        3: {
            title: "Nueva Contraseña",
            description: "Establece tu nueva contraseña",
            icon: "🔒"
        }
    }

    return (
        <>
            {message && (
                <Toast
                    message={message.text}
                    variant={message.type}
                    onClose={() => setMessage(null)}
                />
            )}

            <div className="w-full max-w-md relative">
                <Card
                    title={stepConfig[currentStep].title}
                    description={stepConfig[currentStep].description}
                    icon={stepConfig[currentStep].icon}
                >
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-xs font-medium ${currentStep >= 1 ? 'text-blue-400' : 'text-slate-600'}`}>
                                Usuario
                            </span>
                            <span className={`text-xs font-medium ${currentStep >= 2 ? 'text-blue-400' : 'text-slate-600'}`}>
                                Frase
                            </span>
                            <span className={`text-xs font-medium ${currentStep >= 3 ? 'text-blue-400' : 'text-slate-600'}`}>
                                Contraseña
                            </span>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-linear-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                                style={{ width: `${(currentStep / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Step 1: Verificar Usuario */}
                    {currentStep === 1 && (
                        <form onSubmit={handleCheckUser} className="space-y-6">
                            <Input
                                label="Usuario o Correo Electrónico"
                                type="text"
                                placeholder="Ingresa tu usuario o email"
                                value={userIdentifier}
                                onChange={(e) => setUserIdentifier(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={loading}
                            >
                                Continuar
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                >
                                    ← Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* Step 2: Verificar Frase */}
                    {currentStep === 2 && (
                        <form onSubmit={handleVerifyPhrase} className="space-y-6">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-4">
                                <p className="text-sm text-blue-300">
                                    <span className="font-semibold">Usuario:</span> {userIdentifier}
                                </p>
                            </div>

                            <Input
                                label="Frase de Recuperación"
                                type="text"
                                placeholder="Ingresa tu frase de recuperación"
                                value={recoveryPhrase}
                                onChange={(e) => setRecoveryPhrase(e.target.value)}
                                required
                                helperText="Esta es la frase que configuraste al crear tu cuenta"
                            />

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={loading}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    Atrás
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    isLoading={loading}
                                    className="flex-1"
                                >
                                    Verificar
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Nueva Contraseña */}
                    {currentStep === 3 && (
                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-4">
                                <p className="text-sm text-green-300">
                                    ✓ Frase verificada correctamente
                                </p>
                            </div>

                            <Input
                                label="Nueva Contraseña"
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                helperText="Mínimo 6 caracteres"
                            />

                            <Input
                                label="Confirmar Contraseña"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={loading}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    Atrás
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    isLoading={loading}
                                    className="flex-1"
                                >
                                    Actualizar Contraseña
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>

                {currentStep === 1 && (
                    <p className="text-center text-slate-500 text-sm mt-8">
                        ¿Recordaste tu contraseña? <Link href="/login" className="text-blue-400 font-semibold hover:underline cursor-pointer">Iniciar sesión</Link>
                    </p>
                )}
            </div>
        </>
    )
}