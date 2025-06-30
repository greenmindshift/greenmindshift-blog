# 🌱 GreenMindShift Blog

Ein moderner, SEO-optimierter Blog für nachhaltige Lebensweise mit automatisierter Content-Erstellung über Google Trends und Gemini AI.

## 🚀 Features

- **Modern Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **SEO-Optimiert**: Automatische Sitemap, Meta Tags, Schema.org Markup
- **AI-Content**: Automatische Artikel-Erstellung via Google Trends + Gemini AI
- **CMS**: Vollständiges Content Management System
- **Responsive**: Mobile-first Design
- **Performance**: Optimiert für Core Web Vitals
- **Kubernetes**: Production-ready Deployment

## 🏗️ Architektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Traefik       │    │   Next.js App   │    │   PostgreSQL    │
│   (Ingress)     │────│   (Frontend)    │────│   (Database)    │
│   Port 80/443   │    │   Port 3000     │    │   Port 5434     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │      N8N        │
                       │  (Automation)   │
                       │   Port 5678     │
                       └─────────────────┘
```

## 🛠️ Installation

### Voraussetzungen
- Node.js 18+
- PostgreSQL
- Docker (für Deployment)
- Kubernetes Cluster mit Traefik

### Lokale Entwicklung

1. **Repository klonen**
```bash
git clone <repository-url>
cd greenmindshift-blog
```

2. **Dependencies installieren**
```bash
npm install
```

3. **Environment Variables**
```bash
cp env.example .env.local
# Bearbeite .env.local mit deinen Werten
```

4. **Datenbank Setup**
```bash
# PostgreSQL starten (Port 5434)
docker run --name postgres-greenmindshift \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=greenmindshift \
  -p 5434:5432 \
  -d postgres:15-alpine

# Prisma Setup
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

5. **Development Server starten**
```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## 📁 Projektstruktur

```
greenmindshift-blog/
├── src/
│   ├── app/              # Next.js 14 App Router
│   ├── components/       # React Komponenten
│   ├── hooks/           # Custom React Hooks
│   ├── services/        # API Services
│   ├── styles/          # CSS/Tailwind Styles
│   ├── types/           # TypeScript Typen
│   └── utils/           # Utility Funktionen
├── database/
│   ├── schema.prisma    # Prisma Schema
│   ├── migrations/      # DB Migrationen
│   └── seeds/           # Seed Daten
├── n8n-workflows/       # Automatisierung
├── public/              # Statische Assets
├── docs/                # Dokumentation
└── tests/               # Tests
```

## 🔧 Konfiguration

### Environment Variables

Kopiere `env.example` zu `.env.local` und fülle die Werte aus:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5434/greenmindshift"
NEXTAUTH_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
GOOGLE_SEARCH_API_KEY="your-google-api-key"
```

### API Keys Setup

1. **Gemini AI API**: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Google Search API**: [Google Cloud Console](https://console.cloud.google.com/)
3. **Custom Search Engine**: [Programmable Search Engine](https://programmablesearchengine.google.com/)

## 🤖 N8N Automatisierung

Der Blog nutzt N8N für automatisierte Content-Erstellung:

1. **Täglich**: Google Trends nach Nachhaltigkeit-Keywords durchsuchen
2. **Filtern**: Relevante Trends identifizieren
3. **Recherche**: Automatische Google-Suche für Details
4. **AI-Content**: Gemini AI erstellt Blog-Artikel
5. **Review**: Artikel in Review-Queue für manuellen Check
6. **Publish**: Genehmigte Artikel automatisch veröffentlichen

### N8N Workflow importieren

```bash
# N8N starten
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Workflow importieren: n8n-workflows/google-trends-to-blog.json
```

## 🚀 Deployment

### Kubernetes Deployment

Siehe [Deployment Dokumentation](../greenmindshift-blog-deployment/docs/README.md) für detaillierte Anweisungen.

**Kurzfassung:**

```bash
# Namespace erstellen
kubectl apply -f ../greenmindshift-blog-deployment/k8s/base/namespace.yaml

# Secrets konfigurieren
kubectl create secret generic postgres-secret \
  --from-literal=password=<SECURE_PASSWORD> \
  -n greenmindshift

# Mit Kustomize deployen
kubectl apply -k ../greenmindshift-blog-deployment/k8s/overlays/production/
```

### Docker Build

```bash
# Image bauen
docker build -t greenmindshift/blog:latest .

# Container starten
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e NEXTAUTH_SECRET="..." \
  greenmindshift/blog:latest
```

## 📊 SEO Features

- **Dynamische Meta Tags**: Titel, Beschreibung, Open Graph
- **Strukturierte Daten**: JSON-LD Schema.org Markup
- **Sitemap**: Automatisch generiert unter `/sitemap.xml`
- **Robots.txt**: SEO-freundliche Crawler-Anweisungen
- **URL-Struktur**: `/blog/[slug]` Format
- **Performance**: Optimiert für Core Web Vitals

## 🧪 Testing

```bash
# Unit Tests
npm run test

# Test Coverage
npm run test:coverage

# Type Checking
npm run type-check

# Linting
npm run lint
```

## 📈 Monitoring

### Health Checks

- **App**: `GET /api/health`
- **Database**: Prisma Connection Check
- **N8N**: Workflow Status

### Metriken

- **Performance**: Core Web Vitals
- **Analytics**: Google Analytics 4
- **Uptime**: Kubernetes Health Checks
- **Logs**: Strukturierte JSON Logs

## 🔒 Sicherheit

- **Authentication**: NextAuth.js
- **Authorization**: Role-based Access Control
- **HTTPS**: Let's Encrypt via Traefik
- **Headers**: Security Headers konfiguriert
- **Validation**: Zod Schema Validation
- **Rate Limiting**: API Rate Limits

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne eine Pull Request

### Development Guidelines

- **TypeScript**: Strenge Typisierung verwenden
- **Commits**: Conventional Commits Format
- **Testing**: Tests für neue Features schreiben
- **Documentation**: Code dokumentieren

## 📝 Roadmap

Siehe [ROADMAP.md](./ROADMAP.md) für geplante Features und Entwicklungsphasen.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/greenmindshift/blog/issues)
- **Documentation**: [Docs Verzeichnis](./docs/)
- **Email**: support@greenmindshift.com

## 📄 Lizenz

Dieses Projekt ist unter der MIT Lizenz lizenziert. Siehe [LICENSE](./LICENSE) für Details.

## 🌟 Acknowledgments

- **Next.js Team** für das großartige Framework
- **Vercel** für Hosting und Performance Tools
- **Tailwind CSS** für das Utility-First CSS Framework
- **Prisma** für die TypeScript-first ORM
- **Community** für Feedback und Contributions

---

**Erstellt mit 💚 für eine nachhaltige Zukunft** 