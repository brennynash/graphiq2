import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { uploadImage } from "@/lib/cloudinary";

const prisma = new PrismaClient();

// GET all blogs
export async function GET() {
    try {
        const blogs = await prisma.blogPost.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json({ data: blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

// POST new blog
export async function POST(request) {
    try {
        const formData = await request.formData();

        // Extract and validate the data
        const title = formData.get('title');
        const description = formData.get('description');
        const url = formData.get('url');
        const coverImage = formData.get('image');
        const topic = formData.get('topic') || 'Knowledge';
        const readTime = parseInt(formData.get('readTime')) || 5;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Validate required fields
        if (!title || !description || !url) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Handle cover image
        let coverImageUrl = '';
        if (coverImage instanceof File && coverImage.size > 0) {
            try {
                coverImageUrl = await uploadImage(coverImage);
            } catch (uploadError) {
                console.error('Error uploading cover image:', uploadError);
                return NextResponse.json({ error: 'Failed to upload cover image' }, { status: 500 });
            }
        }

        // Create blog post
        const blog = await prisma.blogPost.create({
            data: {
                title,
                slug,
                topic,
                readTime,
                coverImage: coverImageUrl || null,
                url,
                content: description,
                media: []
            }
        });

        return NextResponse.json({
            message: 'Blog post created successfully',
            blog
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json(
            { error: 'Failed to create blog post', details: error.message },
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
                { error: 'Blog ID is required' },
                { status: 400 }
            );
        }

        const title = formData.get('title');
        const description = formData.get('description');
        const url = formData.get('url');
        const coverImage = formData.get('image');
        const topic = formData.get('topic') || 'Knowledge';
        const readTime = parseInt(formData.get('readTime')) || 5;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const blog = await prisma.blogPost.update({
            where: { id },
            data: {
                title,
                slug,
                topic,
                readTime,
                coverImage: coverImage || null,
                url,
                content: description,
                media: []
            }
        });

        return NextResponse.json({
            message: 'Blog post updated successfully',
            blog
        });
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json(
            { error: 'Failed to update blog post' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();

        await prisma.blogPost.delete({
            where: { id }
        });

        return NextResponse.json({
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog post' },
            { status: 500 }
        );
    }
} 