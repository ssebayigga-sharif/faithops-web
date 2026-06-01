import { ReactNode, useEffect, useState } from "react";
import { Content, Theme } from "@carbon/react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./sidebar";
import { useIsMobileNav } from "@/shared/hooks/useIsMobileNav";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobileNav = useIsMobileNav();
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(!isMobileNav);

  // Desktop: keep rail open. Mobile: start closed, overlay on menu.
  useEffect(() => {
    setIsSideNavExpanded(!isMobileNav);
  }, [isMobileNav]);

  const handleMenuClick = () => {
    if (isMobileNav) {
      setIsSideNavExpanded((expanded) => !expanded);
    }
  };

  const handleCloseSideNav = () => {
    setIsSideNavExpanded(false);
  };

  const contentExpanded = isMobileNav ? false : isSideNavExpanded;

  return (
    <Theme theme="g10">
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
