'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { HOST_SERVER } from '../const';
import { Toast } from '@/components/Toast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
        email: ''
    })
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
            .then((res) => {
                if (res.ok) router.push("/dashboard")
            })
    }, [router])

    useEffect(() => {
        // Check if password was changed
        if (searchParams.get('passwordChanged') === 'true') {
            setFormState({
                error: '',
                loading: false,
                message: 'Contraseña actualizada correctamente',
                status: 'success'
            })
        }
    }, [searchParams])

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormState({
            error: '',
            loading: true,
            message: '',
            status: 'loading'
        })

        if (!userInfo.username || !userInfo.password) {
            setFormState({
                error: "username o password no proporcionados",
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
                body: JSON.stringify(userInfo),
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
                if (data.status === 200) {
                    setUserInfo({
                        username: '',
                        password: '',
                        email: ''
                    })
                    setFormState({
                        error: '',
                        loading: false,
                        message: '',
                        status: 'success'
                    })
                    setTimeout(() => {
                        router.push('/dashboard')
                    }, 500);
                }

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
        <div className='p-6'>
            {formState.message || formState.error || formState.loading ? (
                <Toast
                    duration={1500}
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
                            value={userInfo.username}
                            onChange={(e) => setUserInfo(prev => ({ ...prev, username: e.target.value }))}
                            required
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            value={userInfo.password}
                            onChange={(e) => setUserInfo(prev => ({ ...prev, password: e.target.value }))}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full mt-4 group cursor-pointer"
                            isLoading={formState.loading}
                        >
                            Iniciar Sesión
                        </Button>
                        <Link href="/change-password" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer block mx-auto w-fit">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </form>
                </Card>

                <p className="text-center text-slate-500 text-sm mt-8">
                    ¿No tienes una cuenta? <Link href="/register" className="text-blue-400 font-semibold hover:underline cursor-pointer">Crear cuenta</Link>
                </p>
            </div>
        </div>
    );
}
