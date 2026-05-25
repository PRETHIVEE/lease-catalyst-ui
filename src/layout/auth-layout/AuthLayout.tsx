import { Outlet } from "react-router-dom";
import leaseCatalystLogo from "@/assets/logos/lease-catalyst-logo-full.png";
import xtractLogo from "@/assets/logos/xtract-logo-full.png";
import "./AuthLayout.scss";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <aside className="auth-layout__brand">
        <img
          src={leaseCatalystLogo}
          alt="Lease Catalyst"
          className="auth-layout__logo"
        />
        <div className="auth-layout__powered-by">
          <span>Powered by</span>
          <img
            src={xtractLogo}
            alt="XTRACT.io"
            className="auth-layout__xtract-logo"
          />
        </div>
      </aside>

      <main className="auth-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
