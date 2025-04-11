import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-options';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const screenshot = await prisma.screenshot.findUnique({
      where: {
        id: params.id,
        OR: [
          { userId: session.user.id },
          { isPublic: true },
        ],
      },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!screenshot) {
      return new NextResponse('Screenshot not found', { status: 404 });
    }

    // Increment view count if not the owner
    if (screenshot.userId !== session.user.id) {
      await prisma.screenshot.update({
        where: { id: params.id },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json(screenshot);
  } catch (error) {
    console.error('Error fetching screenshot:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, description, tags, isPublic } = await request.json();

    // Verify ownership
    const existingScreenshot = await prisma.screenshot.findUnique({
      where: { id: params.id },
    });

    if (!existingScreenshot) {
      return new NextResponse('Screenshot not found', { status: 404 });
    }

    if (existingScreenshot.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Create or connect tags
    const tagConnections = tags?.map((tagName: string) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    const screenshot = await prisma.screenshot.update({
      where: { id: params.id },
      data: {
        title,
        description,
        isPublic,
        tags: {
          set: [],
          connectOrCreate: tagConnections,
        },
      },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(screenshot);
  } catch (error) {
    console.error('Error updating screenshot:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify ownership
    const screenshot = await prisma.screenshot.findUnique({
      where: { id: params.id },
    });

    if (!screenshot) {
      return new NextResponse('Screenshot not found', { status: 404 });
    }

    if (screenshot.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.screenshot.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting screenshot:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 