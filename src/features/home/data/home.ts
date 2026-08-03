import type { NavItem } from "../../../shared/types";
import type { ServiceTime, HomeMinistry, StatItem } from "../types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Ministries", path: "/ministries" },
  { label: "Give", path: "/give" },
  { label: "Contact", path: "/contact" },
];

export const SERVICE_TIMES: ServiceTime[] = [
  {
    day: "Saturday",
    time: "09:00 AM",
    name: "Sabbath School",
    description: "Bible study classes for children, youth, and adults.",
  },
  {
    day: "Saturday",
    time: "11:00 AM",
    name: "Divine Worship",
    description: "Congregational worship, prayer, music, and the Word.",
  },
  {
    day: "Wednesday",
    time: "06:30 PM",
    name: "Prayer Meeting",
    description: "Midweek Bible reflection and intercessory prayer.",
  },
  {
    day: "Friday",
    time: "06:00 PM",
    name: "Vespers",
    description: "Welcoming the Sabbath with praise and reflection.",
  },
];

export const MINISTRIES: HomeMinistry[] = [
  {
    id: "1",
    name: "Youth & Pathfinders",
    leader: "Bro. Samuel Opio",
    description:
      "Guiding children and youth in Bible study, character, discipline, and service through Adventurer and Pathfinder ministry.",
    icon: "YP",
    color: "gold",
  },
  {
    id: "2",
    name: "Women's Ministry",
    leader: "Sis. Grace Nakato",
    description:
      "Encouraging spiritual growth, prayer, visitation, and practical care among women and families.",
    icon: "WM",
    color: "navy",
  },
  {
    id: "3",
    name: "Health & Temperance",
    leader: "Dr. Peter Ssempala",
    description:
      "Promoting whole-person wellness, temperance, and community health education.",
    icon: "HT",
    color: "cream",
  },
  {
    id: "4",
    name: "Community Services",
    leader: "Elder Faith Apio",
    description:
      "Serving neighbors through visitation, relief, education support, and practical compassion.",
    icon: "CS",
    color: "gold",
  },
  {
    id: "5",
    name: "Music & Worship",
    leader: "Bro. David Kizza",
    description:
      "Supporting reverent worship through choir, congregational singing, and audio-visual service.",
    icon: "MW",
    color: "navy",
  },
  {
    id: "6",
    name: "Personal Ministries",
    leader: "Sis. Mary Birungi",
    description:
      "Training members in evangelism, Bible studies, and sharing the Three Angels' Messages with the community.",
    icon: "PM",
    color: "cream",
  },
];

export const STATS: StatItem[] = [
  {
    value: "1,240+",
    label: "Baptized Members",
    detail: "Serving in worship, mission, and care",
  },
  {
    value: "1863",
    label: "Movement Organized",
    detail: "Seventh-day Adventist Church",
  },
  {
    value: "28",
    label: "Fundamental Beliefs",
    detail: "Grounded in Scripture",
  },
  {
    value: "7th",
    label: "Sabbath Day",
    detail: "A weekly memorial of creation and redemption",
  },
];
