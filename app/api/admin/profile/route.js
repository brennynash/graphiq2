import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
);

// GET current admin profile
export async function GET(request) {
    try {
        const token = request.cookies.get('admin_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const admin = await prisma.admin.findUnique({
            where: { username: payload.username },
            select: { username: true, id: true }
        });

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ data: admin });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        return NextResponse.json({ error: 'Failed to fetch admin profile' }, { status: 500 });
    }
}

// PUT update admin profile
export async function PUT(request) {
    try {
        const token = request.cookies.get('admin_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const data = await request.json();
        const { currentPassword, newPassword, newUsername } = data;

        // Get current admin
        const admin = await prisma.admin.findUnique({
            where: { username: payload.username }
        });

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        // Check if new username already exists (if username is being changed)
        if (newUsername && newUsername !== admin.username) {
            const existingAdmin = await prisma.admin.findUnique({
                where: { username: newUsername }
            });
            if (existingAdmin) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
            }
        }

        // Update admin
        const updatedAdmin = await prisma.admin.update({
            where: { id: admin.id },
            data: {
                ...(newUsername && { username: newUsername }),
                ...(newPassword && { password: await bcrypt.hash(newPassword, 10) })
            },
            select: { username: true, id: true }
        });

        return NextResponse.json({
            data: updatedAdmin,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
} 