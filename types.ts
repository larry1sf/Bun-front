export interface User {
    username: string,
    email: string,
    id: number,
    securityPhrase: string,
    image?: string | null
}