import type {
  NavItem,
  SermonCard,
  ServiceTime,
  Ministry,
  Leader,
  BeliefItem,
  StatItem,
  ChurchEvent,
} from "./index";

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

export const MINISTRIES: Ministry[] = [
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

export const LEADERS: Leader[] = [
  {
    id: "1",
    name: "Pastor James Mukasa",
    title: "Senior Pastor",
    bio: "Pastor Mukasa has served the Kabulengwa SDA Church for 14 years. A graduate of Bugema University and Andrews University Theological Seminary, he is known for his expository preaching and passion for community transformation.",
    initials: "JM",
    yearsServing: 14,
  },
  {
    id: "2",
    name: "Elder Ruth Namutebi",
    title: "Head Elder",
    bio: "Elder Namutebi leads the board of elders and oversees Sabbath programs. With a background in education and 22 years of dedicated service, she is a spiritual anchor of our congregation.",
    initials: "RN",
    yearsServing: 22,
  },
  {
    id: "3",
    name: "Dr. Peter Ssempala",
    title: "Church Treasurer",
    bio: "Dr. Ssempala brings financial integrity and stewardship excellence to the church. A certified public accountant, he has guided our financial health through growth and community investment programs.",
    initials: "PS",
    yearsServing: 9,
  },
  {
    id: "4",
    name: "Sis. Grace Nakato",
    title: "Communication Director",
    bio: "Sis. Nakato leads all outreach and communication efforts with creativity and strategic vision. She oversees our media ministry, website, and community engagement initiatives.",
    initials: "GN",
    yearsServing: 6,
  },
];

export const BELIEFS: BeliefItem[] = [
  {
    number: 1,
    title: "The Holy Scriptures",
    summary:
      "The Bible is the written Word of God — the infallible revelation of His will and the standard of character and doctrine.",
    scripture: "2 Timothy 3:16–17",
  },
  {
    number: 4,
    title: "The Son",
    summary:
      "God the eternal Son became incarnate in Jesus Christ, who was fully divine and fully human, our only Saviour and Lord.",
    scripture: "John 1:1–3, 14",
  },
  {
    number: 20,
    title: "The Sabbath",
    summary:
      "The seventh day — Saturday — is the Sabbath of the Lord, a day of rest, worship, and deliverance that points to creation and redemption.",
    scripture: "Genesis 2:1–3; Exodus 20:8–11",
  },
  {
    number: 22,
    title: "Christian Stewardship",
    summary:
      "We are stewards of God's time, talents, and resources. Faithful tithing and generous giving are acts of worship.",
    scripture: "Malachi 3:10; Matthew 25:14–30",
  },
  {
    number: 25,
    title: "The Second Coming",
    summary:
      "The return of Christ is the blessed hope of the church — a literal, personal, visible, and worldwide event that is imminent.",
    scripture: "Titus 2:13; Revelation 22:20",
  },
  {
    number: 28,
    title: "The New Earth",
    summary:
      "On the new earth there will be no more suffering or sin. God will dwell with His people forever in the earth made new.",
    scripture: "Revelation 21:1–7; Isaiah 65:17",
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

export const UPCOMING_EVENTS: ChurchEvent[] = [
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
