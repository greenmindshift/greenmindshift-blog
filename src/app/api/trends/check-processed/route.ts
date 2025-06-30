import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const checkProcessedSchema = z.object({
  trendHash: z.string().min(1),
  query: z.string().min(1),
  date: z.string().optional(),
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
    const { trendHash, query, date } = checkProcessedSchema.parse(body);

    // Prüfe ob Trend bereits verarbeitet wurde
    const existingTrend = await prisma.processedTrend.findUnique({
      where: {
        trendHash: trendHash,
      },
    });

    // Prüfe auch Blacklist
    const isBlacklisted = await prisma.trendBlacklist.findFirst({
      where: {
        keyword: {
          contains: query.toLowerCase(),
        },
        active: true,
      },
    });

    const isProcessed = existingTrend !== null;
    const isOnBlacklist = isBlacklisted !== null;

    return NextResponse.json({
      isProcessed,
      isBlacklisted: isOnBlacklist,
      existingTrend: existingTrend ? {
        id: existingTrend.id,
        processed: existingTrend.processed,
        articleCreated: existingTrend.articleCreated,
        articleId: existingTrend.articleId,
        createdAt: existingTrend.createdAt,
      } : null,
      blacklistReason: isBlacklisted?.reason || null,
    });

  } catch (error) {
    console.error('Error checking processed trend:', error);
    
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