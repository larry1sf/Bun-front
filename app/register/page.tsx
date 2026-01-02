'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { HOST_SERVER } from '../const';
import { Toast } from '@/components/Toast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Register() {
    const router = useRouter();
    const hasFetched = useRef(false);
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
    });

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetch(`${HOST_SERVER}/register`, {
            credentials: "include"
        })
            .then(res => {
                if (res.ok) router.push("/dashboard")
            })
    }, [router]);

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState({
            error: '',
            loading: true,
            message: '',
            status: 'loading'
        });

        if (!userInfo.username || !userInfo.password) {
            setFormState({
                error: "Nombre de usuario y contraseña son requeridos",
                loading: false,
                message: "",
                status: 'error'
            });
            return;
        }

        // Validación de contraseña - longitud mínima
        if (userInfo.password.length < 6) {
            setFormState({
                error: "La contraseña debe tener al menos 6 caracteres",
                loading: false,
                message: "",
                status: 'error'
            });
            return;
        }

        // Validación de contraseña - no puede empezar con números
        if (/^\d/.test(userInfo.password)) {
            setFormState({
                error: "La contraseña no puede empezar con números",
                loading: false,
                message: "",
                status: 'error'
            });
            return;
        }

        // Validación de contraseña - solo permite letras, números y símbolos específicos (_*@)
        if (!/^[a-zA-Z][a-zA-Z0-9_*@]*$/.test(userInfo.password)) {
            setFormState({
                error: "La contraseña solo puede contener letras, números y los símbolos _ * @",
                loading: false,
                message: "",
                status: 'error'
            });
            return;
        }

        try {
            const response = await fetch(`${HOST_SERVER}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setFormState({
                    error: '',
                    loading: false,
                    message: data.message || 'Cuenta creada exitosamente',
                    status: 'success'
                });

                // Redirigir al login después de un registro exitoso
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            }
            else {
                const errorData = await response.json();
                setFormState({
                    error: errorData.message || 'Error al crear la cuenta',
                    loading: false,
                    message: '',
                    status: 'error'
                });
            }
        } catch (error) {
            console.error('Register error:', error);
            setFormState({
                error: 'Error de conexión con el servidor',
                loading: false,
                message: '',
                status: 'error'
            });
        }
    };

    return (
        <div className="p-8">
            {formState.message || formState.error || formState.loading ? (
                <Toast
                    message={formState.loading ? 'Creando cuenta...' : (formState.error || formState.message)}
                    variant={formState.status}
                    onClose={() => setFormState(prev => ({ ...prev, message: '', error: '' }))}
                />
            ) : null}

            <div className="w-full max-w-md relative">
                <Card
                    title="Crear cuenta"
                    description="Completa los datos para crear tu nueva cuenta"
                    icon="A"
                >
                    <form className="space-y-6" onSubmit={handleForm}>
                        <Input
                            label="Nombre de usuario"
                            type="text"
                            placeholder="usuario123"
                            value={userInfo.username}
                            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                            helperText="Letras, números y caracteres especiales permitidos"
                            required
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            value={userInfo.password}
                            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                            helperText="Mínimo 6 caracteres. Debe empezar con letra. Solo se permiten: letras, números, _ * @"
                            required
                        />

                        <Input
                            label="Correo electrónico (opcional)"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}

                        />

                        <Button
                            type="submit"
                            className="w-full mt-4"
                            isLoading={formState.loading}

                        >
                            Crear Cuenta
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-slate-500 text-sm mt-8">
                    ¿Ya tienes una cuenta? <Link href="/login" className="text-blue-400 font-semibold hover:underline cursor-pointer">Iniciar sesión</Link>
                </p>
            </div>
        </div>
    );
}