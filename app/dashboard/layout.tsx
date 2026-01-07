
import SidebarClient from '@/components/dashboard/SidebarClient'
import { UserProvider } from "@/components/Context/contextInfoUser"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { HOST_SERVER } from "@/app/const"
export default async function WrapperSidebar({ children }: { children: React.ReactNode }) {

    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')
    let user = null

    try {
        const res = await fetch(`${HOST_SERVER}/dashboard`, {
            headers: {
                Cookie: allCookies
            },
            cache: 'no-store'
        })
        const { data, message } = await res.json()

        if (!res.ok) {
            if (res.status !== 200) {
                console.error(message || "Error al obtener datos del usuario")
                redirect("/login")
            }
        }
        user = data
    } catch (error) {
        console.error('Error fetching user data in server sidebar:', error)
        redirect("/login")
    }

    return (
        <UserProvider initialValue={user}>
            <SidebarClient >
                {children}
            </SidebarClient>
        </UserProvider>
    )
}