import type { NavItem } from "@/shared/types";
import type {
  SermonCard,
  ServiceTime,
  HomeMinistry,
  StatItem,
  HomeChurchEvent,
} from "@/features/home/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Sermons", path: "/sermons" },
  { label: "Ministries", path: "/ministries" },
  { label: "Give", path: "/give" },
  { label: "Contact", path: "/contact" },
];

export const SERVICE_TIMES: ServiceTime[] = [
  {
    day: "Saturday",
    time: "09:00 AM",
    name: "Sabbath School",
    description: "In-depth Bible study and discussion for all ages",
  },
  {
    day: "Saturday",
    time: "11:00 AM",
    name: "Divine Worship",
    description: "Our main weekly worship service and sermon",
  },
  {
    day: "Wednesday",
    time: "06:30 PM",
    name: "Prayer Meeting",
    description: "Mid-week intercessory prayer and devotional",
  },
  {
    day: "Friday",
    time: "06:00 PM",
    name: "Vespers",
    description: "Welcoming the Sabbath with praise and reflection",
  },
];

export const FEATURED_SERMONS: SermonCard[] = [
  {
    id: "1",
    title: "The Everlasting Gospel",
    speaker: "Pastor James Mukasa",
    date: "June 7, 2025",
    duration: "52 min",
    scripture: "Revelation 14:6–12",
    tag: "Featured",
  },
  {
    id: "2",
    title: "Sanctuary Truth for Today",
    speaker: "Elder Ruth Namutebi",
    date: "May 31, 2025",
    duration: "46 min",
    scripture: "Hebrews 8:1–2",
    tag: "Recent",
  },
  {
    id: "3",
    title: "Health: The Temple Restored",
    speaker: "Pastor James Mukasa",
    date: "May 24, 2025",
    duration: "38 min",
    scripture: "1 Corinthians 6:19",
    tag: "Series",
  },
  {
    id: "4",
    title: "Standing Firm in the Last Days",
    speaker: "Bro. Samuel Opio",
    date: "May 17, 2025",
    duration: "41 min",
    scripture: "Ephesians 6:10–18",
    tag: "Youth",
  },
];

export const MINISTRIES: HomeMinistry[] = [
  {
    id: "1",
    name: "Youth & Pathfinders",
    leader: "Bro. Samuel Opio",
    description:
      "Equipping the next generation with faith, character, and service skills through Pathfinder and Adventurer clubs.",
    icon: "🌟",
    color: "gold",
  },
  {
    id: "2",
    name: "Women's Ministry",
    leader: "Sis. Grace Nakato",
    description:
      "Nurturing spiritual growth, community, and empowerment for women at every stage of life.",
    icon: "✦",
    color: "navy",
  },
  {
    id: "3",
    name: "Health & Temperance",
    leader: "Dr. Peter Ssempala",
    description:
      "Promoting God's ideal of total wellness through NEWSTART principles and community health programs.",
    icon: "❤",
    color: "cream",
  },
  {
    id: "4",
    name: "Community Services",
    leader: "Elder Faith Apio",
    description:
      "Serving our neighbors through food banks, disaster relief, education sponsorships, and care visits.",
    icon: "🤝",
    color: "gold",
  },
  {
    id: "5",
    name: "Music & Worship",
    leader: "Bro. David Kizza",
    description:
      "Leading the congregation in Spirit-filled praise through choir, instrumental ministry, and audio-visual production.",
    icon: "♪",
    color: "navy",
  },
  {
    id: "6",
    name: "Personal Ministries",
    leader: "Sis. Mary Birungi",
    description:
      "Training members in evangelism, Bible studies, and sharing the Three Angels' Messages with the community.",
    icon: "✉",
    color: "cream",
  },
];

export const STATS: StatItem[] = [
  {
    value: "1,240+",
    label: "Baptized Members",
    detail: "Across 3 campus locations",
  },
  { value: "1863", label: "Year Founded", detail: "Adventist movement begins" },
  {
    value: "21M+",
    label: "Global Members",
    detail: "In 215 countries worldwide",
  },
  {
    value: "28",
    label: "Fundamental Beliefs",
    detail: "Grounded in Scripture alone",
  },
];

export const UPCOMING_EVENTS: HomeChurchEvent[] = [
  {
    id: "1",
    title: "Youth Week of Prayer",
    date: "June 21, 2025",
    day: "21",
    month: "JUN",
    time: "09:00 AM",
    location: "Main Sanctuary",
    category: "Youth",
  },
  {
    id: "2",
    title: "Community Health Seminar",
    date: "June 28, 2025",
    day: "28",
    month: "JUN",
    time: "10:00 AM",
    location: "Fellowship Hall",
    category: "Community",
  },
  {
    id: "3",
    title: "Evangelism Training",
    date: "July 5, 2025",
    day: "05",
    month: "JUL",
    time: "02:00 PM",
    location: "Room 12",
    category: "Study",
  },
  {
    id: "4",
    title: "Pathfinder Investiture",
    date: "July 12, 2025",
    day: "12",
    month: "JUL",
    time: "11:00 AM",
    location: "Main Sanctuary",
    category: "Youth",
  },
];
