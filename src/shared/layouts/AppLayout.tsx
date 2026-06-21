import { ReactNode, useCallback, useEffect, useState } from "react";
import { Content, Theme } from "@carbon/react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./sidebar";
import { useIsMobileNav } from "@/shared/hooks/useIsMobileNav";
import { useAppTheme } from "@/shared/hooks/useTheme";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobileNav = useIsMobileNav();
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const { theme } = useAppTheme();

  useEffect(() => {
    const width = window.innerWidth;
    if (width > 1056) {
      setIsSideNavExpanded(true); // Desktop: expanded by default
    } else {
      setIsSideNavExpanded(false); // Tablet & Mobile: collapsed by default
    }
  }, [isMobileNav]);

  const handleMenuClick = useCallback(() => {
    const width = window.innerWidth;
    // On desktop (> 66rem), toggle expand/collapse
    if (width > 1056) {
      setIsSideNavExpanded((expanded) => !expanded);
    } else {
      // On tablet & mobile, overlay opens/closes
      setIsSideNavExpanded((expanded) => !expanded);
    }
  }, []);

  const handleCloseSideNav = useCallback(() => {
    const width = window.innerWidth;
    // Only close on tablet/mobile overlay; desktop stays as-is
    if (width <= 1056) {
      setIsSideNavExpanded(false);
    }
  }, []);

  // Desktop: sidebar rail is always visible; content adjusts margin
  // Tablet/Mobile: sidebar is overlay; content always has no margin
  const isDesktop =
    typeof window !== "undefined" ? window.innerWidth > 1056 : true;
  const contentExpanded = isDesktop ? isSideNavExpanded : false;

  return (
    <Theme theme={theme}>
      <div className="app-shell">
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
            <section className="app-shell__page">{children}</section>
          </main>
          <Footer />
        </Content>
      </div>
    </Theme>
  );
};

export default AppLayout;
