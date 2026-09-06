# myDailyCards

**Your daily internet, one card at a time.**

A polished, futuristic social news platform. Instagram/Twitter/Reddit, but every post is a news story. Built with React and Vite as a frontend-only SaaS demo.

## Features

- **Social Feed** — Vertical scroll with news stories as social posts
- **Source Identity** — Each post shows the source as the "author" with logo/avatar
- **Article Images** — Every card features a prominent image from the source
- **AI Summaries** — Clearly labeled AI-generated summaries with confidence scores
- **Social Interactions** — Like, comment, share, save (persisted in localStorage)
- **Reddit-like Discussions** — Comment threads with sorting (Top/Newest/Relevant)
- **Explain This** — ChatGPT-style bottom sheet explaining why stories matter
- **Multi-Source Stories** — See when multiple sources cover the same story
- **Daily Feed Structure** — Navigate through 7 days of news
- **End-of-Day Experience** — Beautiful "You're caught up" completion screen
- **Boomerang Effect** — Smooth transition to previous day's feed
- **Discover Page** — Trending topics and visual story tiles
- **Trends Page** — Topic momentum and keyword analytics
- **AI Chat** — Ask questions about today's briefing
- **Saved Posts** — Bookmarked stories collection
- **Full Reading Experience** — In-app reader before opening original source
- **Global Search** — Search across titles, summaries, keywords, sources
- **Service Status** — Subtle indicator showing backend service health
- **Light/Dark Themes** — Warm caramel/coffee palette with smooth transitions
- **Responsive Design** — Mobile-first with desktop sidebar and right rail

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### GitHub Pages Deployment

This project is configured for GitHub Pages hosting as a static Vite app.

1. Push the repository to GitHub.
2. In GitHub, open Settings → Pages.
3. Set the source to GitHub Actions.
4. The included workflow in `.github/workflows/deploy.yml` will build and deploy the app automatically.

For local production preview:

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

The app uses a relative `base` path (`./`) so it works correctly from a project site such as `https://username.github.io/myDailyCardsUI/`.

## Project Structure

```
myDailyCardsUI/
├── public/
│   └── sampledata.json          # Demo dataset with images, discussions, social counts
├── src/
│   ├── components/
│   │   ├── feed/                # SocialFeed, NewsPost, PostActions, AISummary, EndOfDay
│   │   ├── discussion/          # DiscussionDrawer, CommentItem
│   │   ├── explain/             # ExplainSheet (ChatGPT-style)
│   │   ├── navigation/          # TopBar, BottomNav, Sidebar, DaySelector
│   │   ├── pages/               # DiscoverPage, TrendsPage, ChatPage, SavedPage
│   │   ├── reader/              # StoryReader (full reading experience)
│   │   └── shared/              # SourceAvatar, ServiceStatus, SearchOverlay
│   ├── services/
│   │   ├── data.js              # Data loading and queries
│   │   └── api.js               # API abstraction (demo mode)
│   ├── hooks/
│   │   ├── useLocalStorage.js   # Persistent state hook
│   │   └── useInteractions.js   # Likes, saves, shares state
│   ├── css/
│   │   └── style.css            # Complete design system
│   ├── App.jsx                  # Main app with routing
│   └── main.jsx                 # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Data Layer

The app uses a centralized `DataService` in `src/services/data.js` that loads `public/sampledata.json`. This modular layer can be swapped for a real API later without changing UI components.

The sample data includes:
- 7 days of news stories (31 total)
- Categories: AI, Technology, Startups, Business, Finance, Science, Sports, World
- AI summaries with confidence scores
- Source information with credibility ratings
- Demo social interactions (likes, shares, comments)
- Discussion threads for each story
- Story clusters for multi-source coverage

## Design System

### Colors
Warm caramel/coffee palette:
- Primary: `#8B5E3C` (warm brown)
- Secondary: `#A67C52` (caramel)
- Cream: `#F5EFE0` (light backgrounds)
- Coffee: `#4A3426` (dark accents)

### Typography
- **Inter** — UI elements, body text
- **Newsreader** — Headlines, editorial content

### Layout
- Mobile: Single column feed with bottom navigation
- Tablet: Single column feed with wider cards
- Desktop: Sidebar + centered feed + right rail

## Demo Mode

The app runs entirely in demo mode with sample data. All interactions (likes, saves, shares) are persisted in localStorage. The "DEMO" badge is displayed in the right rail to indicate sample data.

## License

MIT
