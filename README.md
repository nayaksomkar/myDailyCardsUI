# myDailyCards

A premium Apple-style daily news and knowledge reader built with React and Vite. Features a soft, minimal visual language with warm brown, caramel, coffee, and cream accent palette, light/dark themes, and a personal daily briefing experience.

## Features

- 7-day sample timeline navigation
- Topic/category filters and keyword-based selection
- Search across headlines, summaries, and keywords
- Source-type filtering
- Beautiful compact news cards with AI summaries
- Story clusters grouping related multi-source stories
- Detailed reading view with key points and source attribution
- "Explain this" conversational panel using sample chat data
- Bookmarks (persisted in localStorage)
- Read/unread states (persisted in localStorage)
- Light/dark theme toggle (persisted in localStorage)
- Responsive layout for desktop, tablet, and mobile

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

## Project Structure

```
myDailyCardsUI/
├── public/
│   └── sampledata.json
├── src/
│   ├── components/
│   ├── services/
│   │   └── data.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── css/
│   │   └── style.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Data Layer

The app uses a centralized `DataService` in `src/services/data.js` that loads `public/sampledata.json`. This modular layer can be swapped for a real API later without changing UI components.

## Theming

The app supports light and dark themes, persisted in `localStorage`. The warm accent palette uses brown, caramel, coffee, and cream tones.
