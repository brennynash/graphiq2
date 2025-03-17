import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req) {
    try {
        // Get the token from the cookie
        const token = req.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // If we get here, the token is valid
        return NextResponse.json({ authenticated: true });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
} 