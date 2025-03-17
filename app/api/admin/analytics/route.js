import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Get current month's data
        const currentMonth = await prisma.analytics.findFirst({
            where: {
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            }
        });

        // Get last month's data for trend calculation
        const lastMonth = await prisma.analytics.findFirst({
            where: {
                month: new Date().getMonth(),
                year: new Date().getFullYear()
            }
        });

        const visitors = currentMonth?.visitors || 0;
        const lastMonthVisitors = lastMonth?.visitors || 0;

        // Calculate trend (percentage change)
        const trend = lastMonthVisitors === 0
            ? 0
            : ((visitors - lastMonthVisitors) / lastMonthVisitors) * 100;

        return NextResponse.json({
            visitors,
            trend,
            currentMonth: currentMonth || null,
            lastMonth: lastMonth || null
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
} 