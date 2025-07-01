// app/api/comments/[id]/vote/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const commentId = context.params.id;
    const { voteType } = await req.json(); // 'upvote' or 'downvote'

    if (!['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: {
        upvotes: voteType === 'upvote' ? { increment: 1 } : undefined,
        downvotes: voteType === 'downvote' ? { increment: 1 } : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[COMMENT VOTE ERROR]', error);
    return NextResponse.json({ error: 'Failed to vote on comment' }, { status: 500 });
  }
}
