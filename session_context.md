# Session Context - GreenMindShift Blog

## Projekt Kontext
**Projektname**: GreenMindShift Blog  
**Domain**: https://greenmindshift.com  
**Typ**: Nachhaltigkeits-News Blog mit automatisierter Content-Erstellung  
**Zielgruppe**: Menschen interessiert an nachhaltigen Lösungen  

## Technische Spezifikationen

### Architektur
- **Framework**: Next.js 14 mit App Router
- **Datenbank**: PostgreSQL (Port 5434)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Kubernetes mit Traefik Ingress
- **Automatisierung**: N8N Workflows + Gemini AI
- **Duplikatserkennung**: Multi-Level Hash-System

### Verzeichnisstruktur
```
/greenmindshift-blog/
├── src/
│   ├── components/     # React Komponenten
│   ├── pages/         # Next.js Pages (falls App Router nicht ausreicht)
│   ├── app/           # Next.js 14 App Router
│   │   └── api/       # API Routes
│   │       ├── trends/    # Trend-Management APIs
│   │       └── content/   # Content-Duplikat APIs
│   ├── styles/        # CSS/Tailwind Styles
│   ├── utils/         # Utility Funktionen
│   │   └── deduplication.ts  # Duplikatserkennung Logic
│   ├── hooks/         # Custom React Hooks
│   ├── services/      # API Services & External Integrations
│   └── types/         # TypeScript Type Definitionen
├── public/            # Statische Assets
├── database/          # DB Migrations & Seeds
├── n8n-workflows/     # Automatisierung Workflows
│   ├── google-trends-to-blog.json           # Original Workflow
│   └── google-trends-deduplication.json     # Mit Duplikatserkennung
├── config/            # Konfigurationsdateien
├── docs/              # Dokumentation
│   └── deduplication-system.md  # Duplikatssystem Docs
└── tests/             # Test Dateien

/greenmindshift-blog-deployment/
├── k8s/              # Kubernetes Manifests
├── docs/             # Deployment Dokumentation
├── helm-charts/      # Helm Charts (optional)
└── monitoring/       # Monitoring Konfiguration
```

### Datenbank Schema (Erweitert)
```sql
-- Artikel (erweitert um Duplikatserkennung)
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  author_id INTEGER,
  seo_title VARCHAR(255),
  seo_description TEXT,
  google_trends_data JSONB,
  ai_generated BOOLEAN DEFAULT FALSE,
  source_hash VARCHAR(255), -- Hash des ursprünglichen Trends
);

-- Verarbeitete Trends (NEU)
CREATE TABLE processed_trends (
  id VARCHAR(255) PRIMARY KEY,
  trend_hash VARCHAR(255) UNIQUE NOT NULL,
  query VARCHAR(255) NOT NULL,
  traffic VARCHAR(100),
  date VARCHAR(50) NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  article_created BOOLEAN DEFAULT FALSE,
  article_id VARCHAR(255),
  source_data JSONB,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content Hashes (NEU)
CREATE TABLE content_hashes (
  id VARCHAR(255) PRIMARY KEY,
  content_hash VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  source VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trend Blacklist (NEU)
CREATE TABLE trend_blacklist (
  id VARCHAR(255) PRIMARY KEY,
  keyword VARCHAR(255) UNIQUE NOT NULL,
  reason TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Kategorien
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) -- Hex color
);

-- Tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL
);

-- Artikel-Kategorien Relation
CREATE TABLE article_categories (
  article_id INTEGER REFERENCES articles(id),
  category_id INTEGER REFERENCES categories(id),
  PRIMARY KEY (article_id, category_id)
);

-- Artikel-Tags Relation
CREATE TABLE article_tags (
  article_id INTEGER REFERENCES articles(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (article_id, tag_id)
);
```

### SEO URL Struktur
- **Homepage**: `/`
- **Blog Übersicht**: `/blog`
- **Artikel**: `/blog/[slug]` (z.B. `/blog/nachhaltige-energie-trends-2024`)
- **Kategorie**: `/kategorie/[slug]` (z.B. `/kategorie/erneuerbare-energie`)
- **Tag**: `/tag/[slug]` (z.B. `/tag/solar`)
- **Über uns**: `/ueber-uns`
- **Kontakt**: `/kontakt`

### N8N Workflow Konzept (Erweitert)
1. **Trend Monitoring**: Täglich Google Trends abfragen für Nachhaltigkeit Keywords
2. **Hash-Erstellung**: SHA256 Hash für jeden Trend erstellen
3. **Duplikat-Prüfung**: API Call zu `/api/trends/check-processed`
4. **Blacklist-Check**: Prüfung gegen unerwünschte Keywords
5. **Processing-Mark**: Trend als "in Bearbeitung" markieren
6. **Content Research**: Automatische Google Suche basierend auf neuen Trends
7. **Content-Hash**: Hash für generierten Content erstellen
8. **Content-Duplikat-Check**: Prüfung gegen ähnliche Inhalte
9. **AI Content Generation**: Gemini AI erstellt Artikel-Entwürfe (nur für einzigartige Inhalte)
10. **Quality Review**: Content in Review-Queue für manuellen Check
11. **Auto-Publishing**: Genehmigte Artikel automatisch veröffentlichen
12. **Hash-Speicherung**: Content-Hash für zukünftige Duplikatserkennung speichern
13. **Social Media**: Auto-Post auf verschiedenen Plattformen

### Duplikatserkennung - 4 Ebenen
1. **Trend-Hash**: Verhindert identische Trend-Verarbeitung
2. **Blacklist**: Filtert unerwünschte Keywords
3. **Content-Hash**: Verhindert ähnlichen generierten Content
4. **Ähnlichkeits-Analyse**: Semantische Ähnlichkeitsprüfung (70% Threshold)

### Kubernetes Deployment
- **Namespace**: `greenmindshift`
- **Ingress**: Traefik (bereits im kube-system namespace)
- **Domain**: greenmindshift.com
- **SSL**: Let's Encrypt automatisch via Traefik
- **Database**: PostgreSQL StatefulSet (Port 5434)

## Entwicklungsrichtlinien

### Code Standards
- **TypeScript**: Strenge Typisierung
- **ESLint + Prettier**: Code Formatierung
- **Commit Convention**: Conventional Commits
- **Testing**: Jest + React Testing Library
- **Documentation**: JSDoc für komplexe Funktionen

### Performance Ziele
- **Lighthouse Score**: 95+
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s

### SEO Anforderungen
- **Meta Tags**: Dynamisch für jeden Artikel
- **Open Graph**: Social Media Previews
- **JSON-LD**: Strukturierte Daten
- **Sitemap**: Automatisch generiert
- **Robots.txt**: Suchmaschinen-Anweisungen

## Aktuelle Session

### Letzte Änderungen
- [2024-01-XX] Projektstruktur erstellt
- [2024-01-XX] Roadmap definiert
- [2024-01-XX] Session Context dokumentiert
- [2024-01-XX] **Duplikatssystem implementiert**
  - Erweiterte Datenbank-Tabellen für Trend-Tracking
  - API Endpoints für Duplikatserkennung
  - N8N Workflow mit Multi-Level-Prüfung
  - Utility-Funktionen für Hash-Erstellung und Ähnlichkeitsprüfung
  - Umfassende Dokumentation des Systems

### Implementierte Features
✅ **Duplikatserkennung**:
- ProcessedTrend Tabelle mit eindeutigen Hashes
- ContentHash Tabelle für Content-Duplikate
- TrendBlacklist für unerwünschte Keywords
- API Endpoints: `/api/trends/check-processed`, `/api/trends/mark-processing`, `/api/content/check-hash`
- Utility-Funktionen in `src/utils/deduplication.ts`
- Erweiterte N8N Workflows mit Duplikatsprüfung

### Nächste Schritte
1. Next.js 14 Projekt initialisieren
2. PostgreSQL Verbindung einrichten (Port 5434)
3. Prisma Migrationen für erweiterte Tabellen ausführen
4. API Endpoints testen
5. N8N Workflow mit Duplikatserkennung importieren
6. Grundlegende Komponenten erstellen

### Offene Fragen
- [ ] Welche spezifischen Google Trends Keywords?
- [ ] Gemini AI API Limits und Kosten?
- [ ] Content Moderation Strategie?
- [ ] Backup und Disaster Recovery?
- [x] **Duplikatserkennung implementiert** ✅

### Entwicklungsnotizen
- Port 5434 für PostgreSQL verwenden (andere DBs bereits auf 5432, 5433)
- Traefik Ingress Controller bereits verfügbar im kube-system namespace
- SEO-URLs müssen deutsche Umlaute unterstützen
- Content muss sowohl automatisiert als auch manuell erstellbar sein
- **Duplikatserkennung verhindert doppelte Artikel-Erstellung**
- Hash-basiertes System für effiziente Duplikatsprüfung
- Blacklist-System für Qualitätskontrolle
- Ähnlichkeitsanalyse für semantische Duplikatserkennung

### API Endpoints (Duplikatserkennung)
- `POST /api/trends/check-processed` - Prüft ob Trend bereits verarbeitet
- `POST /api/trends/mark-processing` - Markiert Trend als in Bearbeitung
- `POST /api/trends/mark-completed` - Markiert Trend als abgeschlossen
- `POST /api/content/check-hash` - Prüft Content-Duplikate
- `POST /api/content/store-hash` - Speichert Content-Hash

### Monitoring & Wartung
- Automatische Bereinigung alter Trends (30 Tage)
- Statistiken über verarbeitete Trends
- Performance-Monitoring der Duplikatserkennung
- Blacklist-Management Interface (zukünftig)

## Kontakt & Ressourcen
- **Repository**: [Noch zu erstellen]
- **Deployment Server**: Kubernetes Cluster mit Traefik
- **Monitoring**: [Noch zu konfigurieren]
- **Dokumentation**: Diese Datei + Roadmap + Duplikatssystem Docs 