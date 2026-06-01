import { NavLink } from "react-router-dom";
import {
  administrationNavigationItems,
  footerNavigationItems,
} from "@/shared/data/navigation";

const currentYear = new Date().getFullYear();

const Footer = () => (
  <footer className="app-shell__footer">
    <div className="app-footer__brand">
      <div className="app-footer__brand-heading">
        <span className="app-footer__brand-mark" aria-hidden>
          FO
        </span>
        <span>
          <strong>FaithOps</strong>
          <small>Church Management System</small>
        </span>
      </div>
      <p>
        A focused workspace for membership, attendance, giving, events, and
        ministry operations.
      </p>
    </div>

    <nav className="app-footer__nav" aria-label="Footer navigation">
      <h2>Workspace</h2>
      <div className="app-footer__link-grid">
        {footerNavigationItems.map((item) => (
          <NavLink to={item.path} key={item.label}>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>

    <nav className="app-footer__nav" aria-label="Support navigation">
      <h2>Support</h2>
      <div className="app-footer__link-grid app-footer__link-grid--compact">
        {administrationNavigationItems.map((item) => (
          <NavLink to={item.path} key={item.label}>
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/privacy">Privacy</NavLink>
        <NavLink to="/support">Contact support</NavLink>
      </div>
    </nav>

    <div className="app-footer__bottom">
      <span>© {currentYear} FaithOps. Built for ministry operations.</span>
      <span className="app-footer__status">
        <span aria-hidden />
        Operational workspace
      </span>
    </div>
  </footer>
);

export default Footer;
