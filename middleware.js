import { NextResponse } from 'next/server';

export async function middleware(request) {
    // Allow all requests through
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
}; 