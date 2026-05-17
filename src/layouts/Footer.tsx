import { footerNavigationItems } from "../churchTypes/navigation";
import { NavLink } from "react-router-dom";


const Footer = () => (
  <div>
  <footer className="app-shell__footer py-200px">
    <div>
      <strong>FaithOps Church Management</strong>
      <span>Built for ministry operations</span>
    </div>
    <nav aria-label="Footer navigation">
      {footerNavigationItems.map((item) => (
        <NavLink to={item.path} key={item.label}>
          {item.label}
        </NavLink>
      ))}
    </nav>
    </footer>
  </div>  
);

export default Footer;
