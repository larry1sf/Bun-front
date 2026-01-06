
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

        if (!res.ok) {
            if (res.status !== 200) {
                console.error("Error al obtener datos del usuario")
                // redirect("/login")
                return
            }
        }
        const { data } = await res.json()
        user = data
        console.log(data);
    } catch (error) {
        console.error('Error fetching user data in server sidebar:', error)
        // redirect("/login")
        // console.log("Error redirect abajo");

    }

    return (
        <UserProvider initialValue={user}>
            <SidebarClient >
                {children}
            </SidebarClient>
        </UserProvider>
    )
}