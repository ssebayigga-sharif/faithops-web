import { ReactNode, useState } from "react";
import { Content, Theme } from "@carbon/react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);

  return (
    <Theme theme="g10">
      <div className="app-shell">
        <Header
          isSideNavExpanded={isSideNavExpanded}
          onMenuClick={() =>
            setIsSideNavExpanded((isExpanded) => !isExpanded)
          }
        />
        <Sidebar isExpanded={isSideNavExpanded} />

        <Content
          className={
            isSideNavExpanded
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
