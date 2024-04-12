// import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
// import { Header, Footer } from "./../components";

const RootLayout: React.FC = () => {
  // const location = useLocation();

  // const hiddenPaths = ["/login", "/register", "/forgot"];

  // const hideHeaderFooter = hiddenPaths.includes(location.pathname);
  return (
    <div className="root-layout">
      {/* {!hideHeaderFooter && <Header />} */}
      <main>
        <Outlet />
      </main>
      {/* {!hideHeaderFooter && <Footer />} */}
    </div>
  );
};

export default RootLayout;
