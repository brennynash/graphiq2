import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

// GET all members
export async function GET() {
    try {
        const members = await prisma.member.findMany({
            orderBy: {
                order: 'asc'
            }
        });
        return NextResponse.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        return NextResponse.json(
            { error: 'Failed to fetch members' },
            { status: 500 }
        );
    }
}

// POST new member
export async function POST(request) {
    try {
        const formData = await request.formData();

        // Extract data from formData
        const name = formData.get('name');
        const title = formData.get('title');
        const description = formData.get('description');
        const order = parseInt(formData.get('order') || '0');
        const isActive = formData.get('isActive') === 'true';

        // Validate required fields
        if (!name || !title || !description) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Handle image file if present
        let profileImage = '';
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            try {
                profileImage = await uploadImage(imageFile);
            } catch (error) {
                console.error('Error uploading image:', error);
                return NextResponse.json(
                    { error: 'Failed to upload image' },
                    { status: 500 }
                );
            }
        }

        const member = await prisma.member.create({
            data: {
                name,
                title,
                description,
                profileImage,
                order,
                isActive
            }
        });

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error creating member:', error);
        return NextResponse.json(
            { error: 'Failed to create member' },
            { status: 500 }
        );
    }
} 