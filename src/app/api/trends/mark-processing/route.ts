import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const markProcessingSchema = z.object({
  trendHash: z.string().min(1),
  query: z.string().min(1),
  traffic: z.string().optional(),
  date: z.string().min(1),
  sourceData: z.any().optional(),
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
    const { trendHash, query, traffic, date, sourceData } = markProcessingSchema.parse(body);

    // Erstelle oder aktualisiere ProcessedTrend Eintrag
    const processedTrend = await prisma.processedTrend.upsert({
      where: {
        trendHash: trendHash,
      },
      update: {
        processed: true,
        updatedAt: new Date(),
      },
      create: {
        trendHash,
        query,
        traffic,
        date,
        sourceData,
        processed: true,
        articleCreated: false,
      },
    });

    return NextResponse.json({
      success: true,
      processedTrend: {
        id: processedTrend.id,
        trendHash: processedTrend.trendHash,
        query: processedTrend.query,
        processed: processedTrend.processed,
        createdAt: processedTrend.createdAt,
      },
    });

  } catch (error) {
    console.error('Error marking trend as processing:', error);
    
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