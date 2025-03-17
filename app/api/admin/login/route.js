import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

// Create a single PrismaClient instance
const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
);

export async function POST(req) {
    try {
        // Parse request body
        const body = await req.json().catch(e => {
            console.error('Failed to parse request body:', e);
            return null;
        });

        if (!body || !body.username || !body.password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        const { username, password } = body;

        // Find admin user
        const admin = await prisma.admin.findUnique({
            where: { username },
        }).catch(e => {
            console.error('Database query failed:', e);
            return null;
        });

        if (!admin) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Compare passwords
        const isValid = await bcrypt.compare(password, admin.password).catch(e => {
            console.error('Password comparison failed:', e);
            return false;
        });

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate token using jose
        const token = await new SignJWT({
            id: admin.id,
            username: admin.username
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1d')
            .sign(JWT_SECRET);

        // Create response
        const response = NextResponse.json(
            { message: "Login successful", redirectTo: '/admin/dashboard' },
            { status: 200 }
        );

        // Set cookie with less restrictive settings for development
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: false, // Set to false for development
            sameSite: 'lax', // Changed from 'strict' to 'lax'
            path: '/',
            maxAge: 86400 // 1 day
        });

        console.log('Setting cookie:', token);
        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
} 