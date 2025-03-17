import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
    try {
        const { currentPassword, newUsername, newPassword } = await req.json();
        const token = req.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
        });

        if (!admin) {
            return NextResponse.json(
                { error: "Admin not found" },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 401 }
            );
        }

        const updates = {};
        if (newUsername) updates.username = newUsername;
        if (newPassword) updates.password = await bcrypt.hash(newPassword, 10);

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: "No changes requested" },
                { status: 400 }
            );
        }

        const updatedAdmin = await prisma.admin.update({
            where: { id: admin.id },
            data: updates,
        });

        return NextResponse.json(
            { message: "Credentials updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating credentials:', error);
        return NextResponse.json(
            { error: "Failed to update credentials" },
            { status: 500 }
        );
    }
} 