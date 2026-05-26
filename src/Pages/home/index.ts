// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  path: string;
}

// ─── Sermon / Content ─────────────────────────────────────────────────────────
export interface SermonCard {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  scripture: string;
  tag: 'Featured' | 'Recent' | 'Series' | 'Youth';
}

// ─── Service Time ─────────────────────────────────────────────────────────────
export interface ServiceTime {
  day: string;
  time: string;
  name: string;
  description: string;
}

// ─── Ministry ─────────────────────────────────────────────────────────────────
export interface Ministry {
  id: string;
  name: string;
  leader: string;
  description: string;
  icon: string;
  color: 'gold' | 'navy' | 'cream';
}

// ─── Leader ───────────────────────────────────────────────────────────────────
export interface Leader {
  id: string;
  name: string;
  title: string;
  bio: string;
  initials: string;
  yearsServing: number;
}

// ─── Belief ───────────────────────────────────────────────────────────────────
export interface BeliefItem {
  number: number;
  title: string;
  summary: string;
  scripture: string;
}

// ─── Stat ─────────────────────────────────────────────────────────────────────
export interface StatItem {
  value: string;
  label: string;
  detail: string;
}

// ─── Event ────────────────────────────────────────────────────────────────────
export interface ChurchEvent {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  category: 'Worship' | 'Community' | 'Youth' | 'Study';
}