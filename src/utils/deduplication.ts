import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TrendData {
  query: string;
  traffic?: string;
  date: string;
  articles?: any[];
  sourceData?: any;
}

export interface ContentSimilarity {
  score: number;
  reason: string;
  existingArticleId?: string;
}

/**
 * Erstellt einen eindeutigen Hash für einen Google Trend
 */
export function createTrendHash(trendData: TrendData): string {
  const normalizedData = {
    query: trendData.query.toLowerCase().trim(),
    date: trendData.date,
    traffic: trendData.traffic || '',
  };
  
  const content = JSON.stringify(normalizedData);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Erstellt einen Hash für generierten Content
 */
export function createContentHash(content: string, title: string): string {
  // Normalisiere Content für bessere Duplikatserkennung
  const normalizedContent = content
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
  
  const hashInput = `${title.toLowerCase()}_${normalizedContent}`;
  return crypto.createHash('sha256').update(hashInput).digest('hex');
}

/**
 * Prüft Ähnlichkeit zwischen zwei Texten (vereinfachte Implementierung)
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set(Array.from(words1).filter(x => words2.has(x)));
  const union = new Set([...Array.from(words1), ...Array.from(words2)]);
  
  return intersection.size / union.size;
}

/**
 * Erweiterte Duplikatsprüfung für Content
 */
export async function checkContentSimilarity(
  title: string,
  content: string,
  threshold: number = 0.7
): Promise<ContentSimilarity> {
  try {
    // Prüfe gegen bestehende Artikel
    const existingArticles = await prisma.article.findMany({
      where: {
        aiGenerated: true,
        status: {
          in: ['PUBLISHED', 'REVIEW'],
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
      },
      take: 50, // Begrenze auf letzte 50 AI-Artikel
      orderBy: {
        createdAt: 'desc',
      },
    });

    let maxSimilarity = 0;
    let mostSimilarArticleId = '';
    let reason = '';

    for (const article of existingArticles) {
      // Titel-Ähnlichkeit
      const titleSimilarity = calculateTextSimilarity(title, article.title);
      
      // Content-Ähnlichkeit (nur erste 500 Zeichen für Performance)
      const contentSample = content.substring(0, 500);
      const existingContentSample = article.content.substring(0, 500);
      const contentSimilarity = calculateTextSimilarity(contentSample, existingContentSample);
      
      // Gewichtete Gesamtähnlichkeit
      const overallSimilarity = (titleSimilarity * 0.4) + (contentSimilarity * 0.6);
      
      if (overallSimilarity > maxSimilarity) {
        maxSimilarity = overallSimilarity;
        mostSimilarArticleId = article.id;
        
        if (titleSimilarity > 0.8) {
          reason = 'Sehr ähnlicher Titel gefunden';
        } else if (contentSimilarity > 0.7) {
          reason = 'Sehr ähnlicher Content gefunden';
        } else {
          reason = 'Ähnlicher Artikel gefunden';
        }
      }
    }

    return {
      score: maxSimilarity,
      reason: maxSimilarity > threshold ? reason : 'Kein ähnlicher Content gefunden',
      existingArticleId: maxSimilarity > threshold ? mostSimilarArticleId : undefined,
    };

  } catch (error) {
    console.error('Error checking content similarity:', error);
    return {
      score: 0,
      reason: 'Fehler bei der Ähnlichkeitsprüfung',
    };
  }
}

/**
 * Prüft ob ein Keyword auf der Blacklist steht
 */
export async function isKeywordBlacklisted(query: string): Promise<{
  isBlacklisted: boolean;
  reason?: string;
}> {
  try {
    const blacklistEntry = await prisma.trendBlacklist.findFirst({
      where: {
        OR: [
          { keyword: query.toLowerCase() },
          { keyword: { contains: query.toLowerCase() } },
        ],
        active: true,
      },
    });

    return {
      isBlacklisted: blacklistEntry !== null,
      reason: blacklistEntry?.reason || undefined,
    };
  } catch (error) {
    console.error('Error checking blacklist:', error);
    return { isBlacklisted: false };
  }
}

/**
 * Fügt einen Trend zur Blacklist hinzu
 */
export async function addToBlacklist(
  keyword: string,
  reason: string
): Promise<boolean> {
  try {
    await prisma.trendBlacklist.create({
      data: {
        keyword: keyword.toLowerCase(),
        reason,
        active: true,
      },
    });
    return true;
  } catch (error) {
    console.error('Error adding to blacklist:', error);
    return false;
  }
}

/**
 * Bereinigt alte ProcessedTrend Einträge (älter als 30 Tage)
 */
export async function cleanupOldTrends(): Promise<number> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.processedTrend.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
        articleCreated: false, // Nur nicht-verarbeitete Trends löschen
      },
    });

    return result.count;
  } catch (error) {
    console.error('Error cleaning up old trends:', error);
    return 0;
  }
}

/**
 * Statistiken über verarbeitete Trends
 */
export async function getTrendStatistics(): Promise<{
  totalProcessed: number;
  articlesCreated: number;
  blacklisted: number;
  duplicatesSkipped: number;
}> {
  try {
    const [totalProcessed, articlesCreated, blacklisted] = await Promise.all([
      prisma.processedTrend.count(),
      prisma.processedTrend.count({ where: { articleCreated: true } }),
      prisma.trendBlacklist.count({ where: { active: true } }),
    ]);

    const duplicatesSkipped = totalProcessed - articlesCreated;

    return {
      totalProcessed,
      articlesCreated,
      blacklisted,
      duplicatesSkipped,
    };
  } catch (error) {
    console.error('Error getting trend statistics:', error);
    return {
      totalProcessed: 0,
      articlesCreated: 0,
      blacklisted: 0,
      duplicatesSkipped: 0,
    };
  }
} 