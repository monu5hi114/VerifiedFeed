import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, mediaUrl, summary } = body;

    const newPost = await prisma.post.create({
      data: {
        title,
        mediaUrl,
        summary,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('[POST ERROR]', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        comments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('[GET ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
