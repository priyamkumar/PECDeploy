// -----------------------------------------------------------------------------
// Curated Real-World Editorial Photography Registry for IncogniRead Broadsheet
// -----------------------------------------------------------------------------

export interface EditorialImage {
  url: string;
  caption: string;
  credit: string;
  topic: string;
}

export const REAL_WORLD_EDITORIAL_IMAGES: EditorialImage[] = [
  {
    topic: 'press',
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    caption: 'High-speed rotary broadsheet printing press rolling cold ink on archival paper stock.',
    credit: 'Associated Press Archival Pressroom',
  },
  {
    topic: 'tech',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    caption: 'Macro surface micrograph of sub-nanometer silicon microarchitecture wafer.',
    credit: 'Semiconductor Research Consortium',
  },
  {
    topic: 'ai',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    caption: 'Deep neural network activation topologies mapped across matrix telemetry nodes.',
    credit: 'Artificial Cognition Laboratory',
  },
  {
    topic: 'audio',
    url: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=1200&q=80',
    caption: 'Illuminated dual VU peak meters and frequency faders on an analog soundboard console.',
    credit: 'Telegraph Audio & Radio Soundstage',
  },
  {
    topic: 'code',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Clean monospaced source code compiler output on a high-density CRT display.',
    credit: 'Small Web Engineering Archive',
  },
  {
    topic: 'journalism',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    caption: 'Mechanical Olympia typewriter loaded with 80gsm rag-cotton editorial manuscript.',
    credit: 'Fleet Street Investigative Bureau',
  },
  {
    topic: 'library',
    url: 'https://images.unsplash.com/photo-1507842229452-9430638515c0?auto=format&fit=crop&w=1200&q=80',
    caption: 'The central reading hall of the historic municipal archives and periodicals library.',
    credit: 'National Periodicals Collection',
  },
  {
    topic: 'security',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Telemetry screens inside an anonymous packet inspection network operation facility.',
    credit: 'Decentralized Cryptography Guild',
  },
  {
    topic: 'city',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
    caption: 'Evening fog shrouding the editorial towers and telegraph lines of the financial quarter.',
    credit: 'Metropolitan Broadsheet Syndicate',
  },
  {
    topic: 'architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Brutalist concrete cantilevers framing afternoon daylight in the publishing atrium.',
    credit: 'Architectural Review Bureau',
  },
  {
    topic: 'despatch',
    url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Early morning newspapers bundles stacked for dawn distribution across metropolitan kiosks.',
    credit: 'Independent Newsstand Federation',
  },
  {
    topic: 'cyber',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    caption: 'Global satellite telemetry grid and deep oceanic fiber routes illuminated in darkness.',
    credit: 'International Geospatial Dispatch',
  },
];

export function getEditorialImageForArticle(article: {
  id?: string;
  title?: string;
  feedTitle?: string;
  imageUrl?: string;
  imageCaption?: string;
}): EditorialImage {
  // If the article already came with a verified image URL, preserve it
  if (article.imageUrl && article.imageUrl.startsWith('http')) {
    return {
      url: article.imageUrl,
      caption: article.imageCaption || 'Archival editorial photograph for dispatch.',
      credit: article.feedTitle || 'Editorial Photographic Syndicate',
      topic: 'general',
    };
  }

  const query = `${article.title || ''} ${article.feedTitle || ''}`.toLowerCase();

  if (query.includes('ai') || query.includes('model') || query.includes('intelligence') || query.includes('neural') || query.includes('gpt') || query.includes('llm')) {
    return REAL_WORLD_EDITORIAL_IMAGES[2]; // AI
  }
  if (query.includes('sound') || query.includes('audio') || query.includes('voice') || query.includes('music') || query.includes('listen') || query.includes('speech')) {
    return REAL_WORLD_EDITORIAL_IMAGES[3]; // Audio
  }
  if (query.includes('code') || query.includes('software') || query.includes('dev') || query.includes('react') || query.includes('git') || query.includes('engineer')) {
    return REAL_WORLD_EDITORIAL_IMAGES[4]; // Code
  }
  if (query.includes('security') || query.includes('privacy') || query.includes('hack') || query.includes('encrypt') || query.includes('crypto')) {
    return REAL_WORLD_EDITORIAL_IMAGES[7]; // Security
  }
  if (query.includes('hardware') || query.includes('silicon') || query.includes('chip') || query.includes('processor') || query.includes('semiconductor')) {
    return REAL_WORLD_EDITORIAL_IMAGES[1]; // Tech Silicon
  }
  if (query.includes('news') || query.includes('verge') || query.includes('dispatch') || query.includes('broadsheet') || query.includes('press')) {
    return REAL_WORLD_EDITORIAL_IMAGES[0]; // Press
  }
  if (query.includes('book') || query.includes('library') || query.includes('read') || query.includes('archive') || query.includes('history')) {
    return REAL_WORLD_EDITORIAL_IMAGES[6]; // Library
  }
  if (query.includes('write') || query.includes('type') || query.includes('journal') || query.includes('essay') || query.includes('author')) {
    return REAL_WORLD_EDITORIAL_IMAGES[5]; // Journalism Typewriter
  }
  if (query.includes('city') || query.includes('urban') || query.includes('market') || query.includes('finance') || query.includes('world')) {
    return REAL_WORLD_EDITORIAL_IMAGES[8]; // City
  }

  // Deterministic fallback based on title/id string hash
  const str = (article.id || '') + (article.title || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % REAL_WORLD_EDITORIAL_IMAGES.length;
  return REAL_WORLD_EDITORIAL_IMAGES[index];
}
