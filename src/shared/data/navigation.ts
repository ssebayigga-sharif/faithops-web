import {
  Building,
  Calendar,
  Dashboard,
  Email,
  Finance,
  Group,
  Help,
  Report,
  Send,
  Settings,
  UserMultiple,
} from "@carbon/icons-react";
import type { NavigationItem } from "@/shared/types";

export type { NavigationItem } from "@/shared/types";

export const primaryNavigationItems: NavigationItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    description: "Overview, insights, and quick actions",
    icon: Dashboard,
  },
  {
    path: "/home",
    label: "Home",
    description: "Overview, insights, and quick actions",
    icon: Dashboard,
  },
  {
    path: "/members",
    label: "Members",
    description: "Member records, profiles, and groups",
    icon: UserMultiple,
  },
  {
    path: "/attendance",
    label: "Attendance",
    description: "Services, events, and check-ins",
    icon: Group,
  },
  {
    path: "/events",
    label: "Events",
    description: "Church calendar and ministry activities",
    icon: Calendar,
  },
  {
    path: "/giving",
    label: "Giving",
    description: "Contributions and financial tracking",
    icon: Finance,
  },
  {
    path: "/reports",
    label: "Reports",
    description: "Operational reports and exports",
    icon: Report,
  },
];

export const administrationNavigationItems: NavigationItem[] = [
  {
    path: "/settings",
    label: "Settings",
    description: "Users, roles, and app preferences",
    icon: Settings,
  },
  {
    path: "/help",
    label: "Help center",
    description: "Guides, support, and documentation",
    icon: Help,
  },
  {
    path: "/contact",
    label: "Contact Us",
    description: "Send us a message or prayer request",
    icon: Email,
  },
];

export const headerNavigationItems = primaryNavigationItems.slice(0, 7);

export const footerNavigationItems = primaryNavigationItems
  .slice(0, 7)
  .reverse();

export const brandIcon = Building;
