import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

// GET all testimonials
export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json(
            { error: 'Failed to fetch testimonials' },
            { status: 500 }
        );
    }
}

// POST new testimonial
export async function POST(request) {
    try {
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
        let profilePhoto = '';
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

        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                title: role,
                text: content,
                profilePhoto,
                isActive
            }
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json(
            { error: 'Failed to create testimonial' },
            { status: 500 }
        );
    }
} 