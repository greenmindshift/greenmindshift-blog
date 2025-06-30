import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const checkHashSchema = z.object({
  contentHash: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Authentifizierung prüfen
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (token !== process.env.BLOG_API_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { contentHash } = checkHashSchema.parse(body);

    // Prüfe ob Content-Hash bereits existiert
    const existingHash = await prisma.contentHash.findUnique({
      where: {
        contentHash: contentHash,
      },
    });

    // Prüfe auch ähnliche Artikel anhand des sourceHash
    const similarArticles = await prisma.article.findMany({
      where: {
        sourceHash: {
          not: null,
        },
        aiGenerated: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        sourceHash: true,
        createdAt: true,
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      exists: existingHash !== null,
      existingContent: existingHash ? {
        id: existingHash.id,
        title: existingHash.title,
        source: existingHash.source,
        createdAt: existingHash.createdAt,
      } : null,
      similarArticles: similarArticles,
      recommendation: existingHash 
        ? 'SKIP_DUPLICATE' 
        : similarArticles.length > 3 
          ? 'REVIEW_SIMILARITY' 
          : 'PROCEED',
    });

  } catch (error) {
    console.error('Error checking content hash:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 