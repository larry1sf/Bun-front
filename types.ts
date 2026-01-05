export interface User {
    username: string | null,
    email: string | null,
    id: number | null,
    securityPhrase: string | null,
    image?: string | null
}

type contentImages =
    { type: "input_text", text: string } |
    { type: "input_image", image_url: string }
// { type: "image", image_url: { url: string } }

type contentText =
    { type: "text", text: string }
export interface Message {
    role: string;
    content: (contentText | contentImages)[];
}

export interface Conversation {
    id: string;
    title: string;
    date: string;
}