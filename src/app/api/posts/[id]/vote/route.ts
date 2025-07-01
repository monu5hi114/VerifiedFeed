import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const postId = context.params.id;
    const { voteType } = await req.json(); // "real" or "fake"

    if (!['real', 'fake'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        realVotes: voteType === 'real' ? { increment: 1 } : undefined,
        fakeVotes: voteType === 'fake' ? { increment: 1 } : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[VOTE ERROR]', error);
    return NextResponse.json({ error: 'Voting failed' }, { status: 500 });
  }
}
