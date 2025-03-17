import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: 'asc' }
        });

        // Get unique industries
        const industries = [...new Set(projects.map(p => p.industry).filter(Boolean))];

        return NextResponse.json({
            data: projects,
            industries
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        // Extract and validate the data
        const title = formData.get('title');
        const name = formData.get('name') || title; // Use title as fallback
        const description = formData.get('description');
        const mainImage = formData.get('mainImage');
        const industry = formData.get('industry');
        const isFeatured = formData.get('isFeatured') === 'true';
        const order = parseInt(formData.get('order')) || 0;

        // Get all images
        const images = [];
        for (let pair of formData.entries()) {
            if (pair[0].startsWith('images[')) {
                images.push(pair[1]);
            }
        }

        // Validate required fields
        if (!title || !description || !mainImage) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create the project
        const project = await prisma.project.create({
            data: {
                title,
                name,
                description,
                mainImage,
                industry,
                isFeatured,
                order,
                images
            }
        });

        return NextResponse.json({
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const title = formData.get('title');
        const name = formData.get('name') || title;
        const description = formData.get('description');
        const mainImage = formData.get('mainImage');
        const industry = formData.get('industry');
        const isFeatured = formData.get('isFeatured') === 'true';
        const order = parseInt(formData.get('order')) || 0;

        // Get all images
        const images = [];
        for (let pair of formData.entries()) {
            if (pair[0].startsWith('images[')) {
                images.push(pair[1]);
            }
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                title,
                name,
                description,
                mainImage,
                industry,
                isFeatured,
                order,
                images
            }
        });

        return NextResponse.json({
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();

        await prisma.project.delete({
            where: { id }
        });

        return NextResponse.json({
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
} 