import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

// GET single member
export async function GET(request, context) {
    const { params } = context;
    try {
        if (!params?.id) {
            return NextResponse.json(
                { error: 'Member ID is required' },
                { status: 400 }
            );
        }

        const member = await prisma.member.findUnique({
            where: {
                id: params.id
            }
        });

        if (!member) {
            return NextResponse.json(
                { error: 'Member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error fetching member:', error);
        return NextResponse.json(
            { error: 'Failed to fetch member' },
            { status: 500 }
        );
    }
}

// UPDATE member
export async function PUT(request, context) {
    const { params } = context;
    try {
        if (!params?.id) {
            return NextResponse.json(
                { error: 'Member ID is required' },
                { status: 400 }
            );
        }

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
        let profileImage = undefined;
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

        const member = await prisma.member.update({
            where: {
                id: params.id
            },
            data: {
                name,
                title,
                description,
                ...(profileImage && { profileImage }),
                order,
                isActive
            }
        });
        return NextResponse.json(member);
    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json(
            { error: 'Failed to update member' },
            { status: 500 }
        );
    }
}

// DELETE member
export async function DELETE(request, context) {
    const { params } = context;
    try {
        if (!params?.id) {
            return NextResponse.json(
                { error: 'Member ID is required' },
                { status: 400 }
            );
        }

        await prisma.member.delete({
            where: {
                id: params.id
            }
        });
        return NextResponse.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        return NextResponse.json(
            { error: 'Failed to delete member' },
            { status: 500 }
        );
    }
} 