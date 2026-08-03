/**
 * Moved out of features/home/data/home.ts — these were exported there but
 * never consumed by any homepage component. They read as About/Doctrine
 * page content (church leadership bios, the 28 Fundamental Beliefs), so
 * they live here instead. If your About page already has its own data
 * file, merge these in there and delete this file.
 */
import type { Leader, BeliefItem } from "../types";

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
    scripture: "2 Timothy 3:16-17",
  },
  {
    number: 4,
    title: "The Son",
    summary:
      "God the eternal Son became incarnate in Jesus Christ, who was fully divine and fully human, our only Saviour and Lord.",
    scripture: "John 1:1-3, 14",
  },
  {
    number: 20,
    title: "The Sabbath",
    summary:
      "The seventh day — Saturday — is the Sabbath of the Lord, a day of rest, worship, and deliverance that points to creation and redemption.",
    scripture: "Genesis 2:1-3; Exodus 20:8-11",
  },
  {
    number: 22,
    title: "Christian Stewardship",
    summary:
      "We are stewards of God's time, talents, and resources. Faithful tithing and generous giving are acts of worship.",
    scripture: "Malachi 3:10; Matthew 25:14-30",
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
    scripture: "Revelation 21:1-7; Isaiah 65:17",
  },
];
