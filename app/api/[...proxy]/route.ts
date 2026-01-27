import { NextRequest, NextResponse } from 'next/server';
import { HOST_SERVER } from '@/app/const';

async function proxy(request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
    const { proxy } = await params;
    const path = proxy.join('/');
    const query = request.nextUrl.search;
    const targetUrl = `${HOST_SERVER}/${path}${query}`;

    try {
        const body = request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : null;

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: request.headers,
            body: body,
            // @ts-ignore
            duplex: 'half', // Required for streaming responses
        });

        const data = await response.blob();

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
    }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
export const HEAD = proxy;
