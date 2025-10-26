import { LinkCard } from './validators';

export const defaultPages: Omit<LinkCard, 'id' | 'i' | 'x' | 'y' | 'w' | 'h'>[] = [
  {
    name: 'Google',
    url: 'https://www.google.com',
    logo: 'https://www.google.com/favicon.ico',
    description: 'Search the web',
    color: '#4285F4',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com',
    logo: 'https://www.youtube.com/favicon.ico',
    description: 'Watch and share videos',
    color: '#FF0000',
  },
  {
    name: 'Gmail',
    url: 'https://mail.google.com',
    logo: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    description: 'Email from Google',
    color: '#EA4335',
  },
  {
    name: 'Google Calendar',
    url: 'https://calendar.google.com',
    logo: 'https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_2020q4.ico',
    description: 'Organize your schedule',
    color: '#1A73E8',
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    logo: 'https://github.com/favicon.ico',
    description: 'Code hosting platform',
    color: '#181717',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com',
    logo: 'https://www.linkedin.com/favicon.ico',
    description: 'Professional networking',
    color: '#0A66C2',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    logo: 'https://twitter.com/favicon.ico',
    description: 'Social networking',
    color: '#1DA1F2',
  },
  {
    name: 'Notion',
    url: 'https://www.notion.so',
    logo: 'https://www.notion.so/images/favicon.ico',
    description: 'All-in-one workspace',
    color: '#000000',
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com',
    logo: 'https://www.reddit.com/favicon.ico',
    description: 'Front page of the internet',
    color: '#FF4500',
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    logo: 'https://news.ycombinator.com/favicon.ico',
    description: 'Tech news and discussion',
    color: '#FF6600',
  },
];

export const getDefaultLayout = (density: 'compact' | 'comfy' | 'poster') => {
  const cardSizes = {
    compact: { w: 2, h: 2 },
    comfy: { w: 3, h: 3 },
    poster: { w: 4, h: 4 },
  };

  const { w, h } = cardSizes[density];
  const cols = 12;
  const cardsPerRow = Math.floor(cols / w);

  return defaultPages.map((page, index) => {
    const id = `default-${index}`;
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;

    return {
      ...page,
      id,
      i: id,
      x: col * w,
      y: row * h,
      w,
      h,
    };
  });
};

export const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return '';
  }
};
