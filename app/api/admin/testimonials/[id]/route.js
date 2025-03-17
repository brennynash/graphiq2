import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

// GET single testimonial
export async function GET(request, context) {
    const { params } = context;
    try {
        if (!params?.id) {
            return NextResponse.json(
                { error: 'Testimonial ID is required' },
                { status: 400 }
            );
        }

        const testimonial = await prisma.testimonial.findUnique({
            where: {
                id: params.id
            }
        });

        if (!testimonial) {
            return NextResponse.json(
                { error: 'Testimonial not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error('Error fetching testimonial:', error);
        return NextResponse.json(
            { error: 'Failed to fetch testimonial' },
            { status: 500 }
        );
    }
}

// UPDATE testimonial
export async function PUT(request, context) {
    const { params } = context;
    try {
        if (!params?.id) {
            return NextResponse.json(
                { error: 'Testimonial ID is required' },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        // Extract data from formData
        const name = formData.get('name');
        const role = formData.get('role');
        const content = formData.get('content');
        const isActive = formData.get('isActive') === 'true';

        // Validate required fields
        if (!name || !role || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Handle image file if present
        let profilePhoto = undefined;
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            try {
                profilePhoto = await uploadImage(imageFile);
            } catch (error) {
                console.error('Error uploading image:', error);
                return NextResponse.json(
                    { error: 'Failed to upload image' },
                    { status: 500 }
                );
            }
        }

        const testimonial = await prisma.testimonial.update({
            where: {
                id: params.id
            },
            data: {
                name,
                title: role,
                text: content,
                ...(profilePhoto && { profilePhoto }),
                isActive
            }
        });
        return NextResponse.json(testimonial);
    } catch (error) {
        console.error('Error updating testimonial:', error);
        return NextResponse.json(
            { error: 'Failed to update testimonial' },
            { status: 500 }
        );
    }
}

// DELETE testimonial
export async function DELETE(request, context) {
    const { params } = context;
    try {
        if (!params?.id) {
            return NextResponse.json(
                { error: 'Testimonial ID is required' },
                { status: 400 }
            );
        }

        await prisma.testimonial.delete({
            where: {
                id: params.id
            }
        });
        return NextResponse.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json(
            { error: 'Failed to delete testimonial' },
            { status: 500 }
        );
    }
} 