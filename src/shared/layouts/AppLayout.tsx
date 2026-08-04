import { Outlet, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Content, Theme } from "@carbon/react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./sidebar";
import { useIsMobileNav } from "../hooks/useIsMobileNav";
import { useAppTheme } from "../hooks/useTheme";

const AppLayout = () => {
  const isMobileNav = useIsMobileNav();
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const { theme } = useAppTheme();
  const location = useLocation();

  // When crossing the desktop ↔ mobile/tablet threshold, reset sidebar state
  useEffect(() => {
    if (isMobileNav) {
      setIsSideNavExpanded(false); // Collapse on mobile/tablet
    } else {
      setIsSideNavExpanded(true); // Expand on desktop
    }
  }, [isMobileNav]);

  // Lock background page scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileNav && isSideNavExpanded) {
      document.body.classList.add("app-sidebar-open");
      document.documentElement.classList.add("app-sidebar-open");
    } else {
      document.body.classList.remove("app-sidebar-open");
      document.documentElement.classList.remove("app-sidebar-open");
    }
    return () => {
      document.body.classList.remove("app-sidebar-open");
      document.documentElement.classList.remove("app-sidebar-open");
    };
  }, [isMobileNav, isSideNavExpanded]);

  // Close sidebar on path change (navigation)
  useEffect(() => {
    if (isMobileNav) {
      setIsSideNavExpanded(false);
    }
  }, [location.pathname, isMobileNav]);

  // Close sidebar on click outside
  useEffect(() => {
    if (!isSideNavExpanded || !isMobileNav) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const sidebarEl = document.querySelector(".app-sidebar");
      const menuBtnEl = document.querySelector(".app-header__menu-toggle");

      if (
        sidebarEl &&
        !sidebarEl.contains(event.target as Node) &&
        (!menuBtnEl || !menuBtnEl.contains(event.target as Node))
      ) {
        setIsSideNavExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSideNavExpanded, isMobileNav]);

  const handleMenuClick = useCallback(() => {
    setIsSideNavExpanded((expanded) => !expanded);
  }, []);

  const handleCloseSideNav = useCallback(() => {
    if (isMobileNav) {
      setIsSideNavExpanded(false);
    }
  }, [isMobileNav]);

  // Desktop: content margin follows sidebar width
  // Mobile/Tablet: content always full-width; sidebar is overlay
  const contentExpanded = !isMobileNav && isSideNavExpanded;

  const shellClasses = [
    "app-shell",
    isMobileNav ? "app-shell--mobile-nav" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Theme theme={theme}>
      <div className={shellClasses}>
        <Header
          isSideNavExpanded={isSideNavExpanded}
          onMenuClick={handleMenuClick}
        />
        <Sidebar
          isExpanded={isSideNavExpanded}
          isMobileNav={isMobileNav}
          onRequestClose={handleCloseSideNav}
        />

        <Content
          className={
            contentExpanded
              ? "app-shell__content app-shell__content--expanded"
              : "app-shell__content"
          }
        >
          <main className="app-shell__main">
            <section className="app-shell__page">
              <Outlet />
            </section>
          </main>
          <Footer />
        </Content>
      </div>
    </Theme>
  );
};

export default AppLayout;
