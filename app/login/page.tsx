'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HOST_SERVER } from '@/app/const';
import { Toast } from '@/components/Toast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    // const searchParams = useSearchParams();

    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
        email: ''
    })
    type estados = 'success' | 'error' | 'info' | 'loading'
    const [formState, setFormState] = useState({
        error: '',
        loading: false,
        message: '',
        status: 'loading' as estados
    })

    useEffect(() => {
        fetch(`${HOST_SERVER}/login`, {
            credentials: "include"
        })
            .then((res) => {
                if (res.ok) router.push("/dashboard")
            })
            .catch((error) => {
                console.error('Login error:', error);
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
            const data = await response.json()
            console.log(data.status);

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
                    message: 'Bienvenido',
                    status: 'success'
                })
                setTimeout(() => {
                    router.push('/dashboard')
                    setFormState({
                        error: '',
                        loading: false,
                        message: '',
                        status: 'loading'
                    })
                }, 500)
                return
            }
            if (data.status === 500) {
                setFormState(prev => ({
                    ...prev,
                    error: 'Contraseña incorrecta',
                    loading: false,
                    status: 'error'

                }))
                return
            }
            else {
                setFormState({
                    error: 'Fallo la conexión',
                    loading: false,
                    message: '',
                    status: 'error'
                })
            }
        } catch (error) {
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
                    message={formState.loading
                        ? 'Cargando...'
                        : (formState.error || formState.message)}
                    variant={formState.status}
                    onClose={() => setFormState(prev => ({ ...prev, message: '', error: '' }))}
                />
            ) : null}

            <div className="w-full max-w-md relative">
                <Card
                    title="Bienvenido de nuevo"
                    description="Ingresa tus credenciales para acceder a tu cuenta"
                    icon="M"
                >
                    <form className="space-y-3 md:space-y-6" onSubmit={handleForm}>
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

                <p className="text-center text-slate-500 text-xs md:text-sm mt-8">
                    ¿No tienes una cuenta? <Link href="/register" className="text-blue-400 font-semibold hover:underline cursor-pointer">Crear cuenta</Link>
                </p>
            </div>
        </div>
    );
}
