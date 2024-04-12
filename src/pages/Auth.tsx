import { useLocation } from "react-router-dom";
import { LoginForm } from "./../components";

const Auth: React.FC = () => {
  const location = useLocation();

  let formComponent: React.ReactNode;
  if (location.pathname === "/") {
    formComponent = <LoginForm />;
  }

  return (
    <section>
      <div className="flex items-center justify-center h-screen overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-yellow-50 items-center justify-center flex-col h-full">
          <img
            src="/assets/images/calamatcha-temp-logo.png"
            alt="auth-form-img"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 bg-white flex flex-col items-center">
          <marquee
            className="mt-12 mb-4 text-center text-2xl text-green-500 font-bold font-serif"
            behavior="scroll"
            direction="right"
            scrollamount="20"
          >
            Chat with ease and enjoy a cup of Green Tea & Calamary!
          </marquee>
          <div className="flex flex-col items-center justify-center h-full">
            {formComponent}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
