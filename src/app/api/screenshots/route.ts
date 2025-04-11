import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-options';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag');
    const isPublic = searchParams.get('public') === 'true';

    const where = {
      userId: session.user.id,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tag && { tags: { some: { name: tag } } }),
      ...(isPublic && { isPublic: true }),
    };

    const [screenshots, total] = await Promise.all([
      prisma.screenshot.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.screenshot.count({ where }),
    ]);

    return NextResponse.json({
      screenshots,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching screenshots:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, description, url, tags, isPublic } = await request.json();

    // Create or connect tags
    const tagConnections = tags?.map((tagName: string) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    const screenshot = await prisma.screenshot.create({
      data: {
        title,
        description,
        url,
        isPublic,
        userId: session.user.id,
        tags: {
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
    console.error('Error creating screenshot:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 