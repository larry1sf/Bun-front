'use client'
import { useUser } from '@/components/Context/contextInfoUser'
import { SquareActivity, Computer, Mails, Pencil } from 'lucide-react'
import { useChat } from '@/components/Context/contextInfoChat'

export default function WelcomeChat() {
    // conextos
    const { user } = useUser()
    const { setMessage } = useChat()

    const handleSendHelp = (theme: string) => {
        setMessage({ role: 'user', content: [{ type: 'text', text: `Hola, necesito ayuda con ${theme.toLowerCase()} para ` }] })
    }
    return (
        <div className="text-center pt-10 px-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-2xl shadow-blue-500/40 mx-auto mb-6 animate-bounce">
                M
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
                ¿En qué puedo ayudarte hoy {user?.username}?
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
                Soy MoIA, tu asistente inteligente. Puedo ayudarte con análisis, código, redacción y más.
            </p>
            {/* ayuda con contexto al modelo */}
            <div className="grid grid-cols-2 gap-3 mt-12 max-w-xl mx-auto">
                {[
                    { icon: <SquareActivity size={30} className="text-blue-500" />, text: "Analiza mi mercado" },
                    { icon: <Computer size={30} className="text-blue-500" />, text: "Escribe un script" },
                    { icon: <Mails size={30} className="text-blue-500" />, text: "Redacta un correo" },
                    { icon: <Pencil size={30} className="text-blue-500" />, text: "Ideas de diseño" }
                ].map((item, i) => (
                    <button
                        onClick={() => handleSendHelp(item.text)}
                        key={i}
                        className="cursor-pointer flex flex-col items-start p-4 rounded-2xl border border-slate-800/50 bg-slate-900/30 hover:bg-slate-800 transition-all text-left group">
                        <span className="text-xl mb-2 group-hover:scale-110 duration-400 transition-transform">{item.icon}</span>
                        <span className="text-sm font-medium text-slate-300">{item.text}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}