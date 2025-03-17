import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

// GET single blog
export async function GET(request, { params }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
        }

        const blog = await prisma.blogPost.findUnique({
            where: { id }
        });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ data: blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}

// PUT (update) blog
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
        }

        const formData = await request.formData();
        const title = formData.get('title');
        const slug = formData.get('slug');
        const topic = formData.get('topic');
        const readTime = parseInt(formData.get('readTime')) || 5;
        const url = formData.get('url') || '';
        const content = formData.get('content') || '';
        const coverImage = formData.get('coverImage');
        const media = formData.getAll('media');

        // Validate required fields
        if (!title || !slug || !topic) {
            return NextResponse.json(
                { error: 'Title, slug, and topic are required' },
                { status: 400 }
            );
        }

        // Handle cover image
        let coverImageUrl = undefined;
        if (coverImage && coverImage.size > 0) {
            try {
                coverImageUrl = await uploadImage(coverImage);
            } catch (error) {
                console.error('Error uploading cover image:', error);
                return NextResponse.json({ error: 'Failed to upload cover image' }, { status: 500 });
            }
        }

        // Handle media files
        let mediaUrls = undefined;
        if (media.length > 0) {
            mediaUrls = [];
            try {
                for (const file of media) {
                    if (file && file.size > 0) {
                        const mediaUrl = await uploadImage(file);
                        mediaUrls.push(mediaUrl);
                    }
                }
            } catch (error) {
                console.error('Error uploading media:', error);
                return NextResponse.json({ error: 'Failed to upload media files' }, { status: 500 });
            }
        }

        // Update blog post
        const blog = await prisma.blogPost.update({
            where: { id },
            data: {
                title,
                slug,
                topic,
                readTime,
                url,
                content,
                ...(coverImageUrl && { coverImage: coverImageUrl }),
                ...(mediaUrls && { media: mediaUrls })
            }
        });

        return NextResponse.json({ data: blog, message: 'Blog updated successfully' });
    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}

// DELETE blog
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
        }

        await prisma.blogPost.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
} 