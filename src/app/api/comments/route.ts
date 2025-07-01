import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { postId, content, proofUrl } = await req.json();

    if (!postId || !content) {
      return NextResponse.json({ error: 'postId and content are required' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        postId,
        content,
        proofUrl,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('[COMMENT ERROR]', error);
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}
