import { Link } from "react-router-dom";
import { Recycle, ArrowRight } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Recycle size={30} />
        <span>RE:SOURCE</span>
      </div>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#features">How It Works</a>
        <a href="#impact">Our Impact</a>
      </div>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/register" className="signup-btn">
          Get Started <ArrowRight size={16} />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;