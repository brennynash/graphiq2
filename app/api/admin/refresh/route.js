import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign, verify } from 'jsonwebtoken';

export async function POST(request) {
    try {
        // Set CORS headers
        const headers = {
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json'
        };

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, { status: 200, headers });
        }

        // Get cookies and await it properly
        const cookieStore = await cookies();
        const currentToken = cookieStore.get('admin_token')?.value;

        if (!currentToken) {
            console.error('No current token found in cookies');
            return NextResponse.json(
                { error: 'No token found' },
                { status: 401, headers }
            );
        }

        try {
            // Verify the current token
            const decoded = verify(currentToken, process.env.JWT_SECRET);

            // Generate new token
            const newToken = sign(
                { userId: decoded.userId },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Set cookie options
            const cookieOptions = {
                httpOnly: false, // Make it accessible to JavaScript
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 // 1 hour
            };

            // Create response with both cookie and token in body
            const response = NextResponse.json(
                { message: 'Token refreshed successfully', token: newToken },
                { status: 200, headers }
            );

            // Set the cookie
            response.cookies.set('admin_token', newToken, cookieOptions);

            return response;

        } catch (verifyError) {
            console.error('Token verification failed:', verifyError);
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401, headers }
            );
        }
    } catch (error) {
        console.error('Refresh error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, headers }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
        }
    });
} 