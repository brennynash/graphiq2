import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

// GET all settings
export async function GET() {
    try {
        const settings = await prisma.settings.findMany();
        // Mask sensitive values
        const maskedSettings = settings.map(setting => ({
            ...setting,
            value: setting.value.startsWith('re_') ? `${setting.value.slice(0, 6)}...` : setting.value
        }));
        return NextResponse.json(maskedSettings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

// POST new setting or update existing
export async function POST(req) {
    try {
        const body = await req.json();
        const { key, value } = body;

        if (!key || !value) {
            return NextResponse.json(
                { error: "Key and value are required" },
                { status: 400 }
            );
        }

        // Upsert the setting
        const setting = await prisma.settings.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });

        // Update environment variable
        process.env[key] = value;

        return NextResponse.json(setting);
    } catch (error) {
        console.error('Error saving setting:', error);
        return NextResponse.json(
            { error: "Failed to save setting" },
            { status: 500 }
        );
    }
} 