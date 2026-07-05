export interface ServiceTime {
  day: string;
  time: string;
  name: string;
  description: string;
}

export interface HomeMinistry {
  id: string;
  name: string;
  leader: string;
  description: string;
  icon: string;
  color: "gold" | "navy" | "cream";
}

export interface Leader {
  id: string;
  name: string;
  title: string;
  bio: string;
  initials: string;
  yearsServing: number;
}

export interface BeliefItem {
  number: number;
  title: string;
  summary: string;
  scripture: string;
}

export interface StatItem {
  value: string;
  label: string;
  detail?: string;
}

