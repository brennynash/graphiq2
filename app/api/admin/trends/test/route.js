import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('Database connection successful');

        // Test query
        const count = await prisma.trend.count();
        console.log('Number of trends:', count);

        return NextResponse.json({
            status: 'ok',
            message: 'Database connection successful',
            count
        });
    } catch (error) {
        console.error('Database connection test error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json({
            status: 'error',
            error: 'Database connection failed',
            details: error.message
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
} 