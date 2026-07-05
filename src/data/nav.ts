export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Initiatives", href: "/initiatives" },
  { label: "Support", href: "/support" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];
