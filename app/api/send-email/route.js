import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

async function getResendApiKey() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'RESEND_API_KEY' }
    });
    return setting?.value;
  } catch (error) {
    console.error('Error fetching Resend API key:', error);
    return null;
  }
}

export async function POST(req) {
  try {
    const apiKey = await getResendApiKey();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Resend API key not configured' }),
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { projectType, budget, name, email, description } = await req.json();

    // Save the request to the database
    await prisma.request.create({
      data: {
        name,
        email,
        projectType,
        budget,
        description
      }
    });

    const data = await resend.emails.send({
      from: 'Graphiq <onboarding@resend.dev>',
      to: ['hello@graphiq.art'],
      subject: 'New Project Inquiry',
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Description:</strong> ${description}</p>
      `
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
