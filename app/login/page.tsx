'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HOST_SERVER } from '../const';
import { Toast } from '@/components/Toast';
import { Background } from '@/components/ui/Background';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formState, setFormState] = useState({
        error: '',
        loading: false,
        message: '',
        status: 'info' as 'success' | 'error' | 'info' | 'loading'
    })

    useEffect(() => {
        fetch(`${HOST_SERVER}/login`, {
            credentials: "include"
        })
            .then(res => {
                if (res.ok) router.push("/dashboard")
            })
    }, [router])

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormState({
            error: '',
            loading: true,
            message: '',
            status: 'loading'
        })

        if (!email || !password) {
            setFormState({
                error: "Email o password no proporcionados",
                loading: false,
                message: "",
                status: 'error'
            })
            return
        }

        try {
            const response = await fetch(`${HOST_SERVER}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setFormState({
                    error: '',
                    loading: false,
                    message: data.message,
                    status: data.status === 200 ? 'success' : 'error'
                })
                if (data.status === 200)
                    router.push('/dashboard')
            }
            else {
                setFormState({
                    error: 'Error al iniciar sesión',
                    loading: false,
                    message: '',
                    status: 'error'
                })
            }
        } catch (error) {
            console.error('Login error:', error);
            setFormState({
                error: 'Error de conexión con el servidor',
                loading: false,
                message: '',
                status: 'error'
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative font-['Inter',sans-serif]">
            <Background />

            {formState.message || formState.error || formState.loading ? (
                <Toast
                    message={formState.loading ? 'Cargando...' : (formState.error || formState.message)}
                    variant={formState.status}
                    onClose={() => setFormState(prev => ({ ...prev, message: '', error: '' }))}
                />
            ) : null}

            <div className="w-full max-w-md relative">
                <Card
                    title="Bienvenido de nuevo"
                    description="Ingresa tus credenciales para acceder a tu cuenta"
                    icon="A"
                >
                    <form className="space-y-6" onSubmit={handleForm}>
                        <Input
                            label="Usuario o correo"
                            type="text"
                            placeholder="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            rightElement={
                                <button type="button" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </button>
                            }
                        />

                        <Button
                            type="submit"
                            className="w-full mt-4"
                            isLoading={formState.loading}
                            icon="→"
                        >
                            Iniciar Sesión
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-slate-500 text-sm mt-8">
                    ¿No tienes una cuenta? <button className="text-blue-400 font-semibold hover:underline">Crear cuenta</button>
                </p>
            </div>
        </div>
    );
}
