import { Link } from "react-router-dom";
import "../styles/choose-action.css";

function ChooseAction() {

  const options = [
    {
      icon: "🔍",
      title: "Resource Seeker",
      description: "Discover and request resources that you need.",
      path: "/seeker",
      button: "Find Resources"
    },
    {
      icon: "📦",
      title: "Resource Provider",
      description: "Share, sell or rent your unused resources.",
      path: "/provider",
      button: "Provide Resources"
    },
    {
      icon: "❤️",
      title: "Donations",
      description: "Donate unused resources and help someone in need.",
      path: "/donations",
      button: "Donate Now"
    }
  ];

  return (
    <div className="choose-container">

      <div className="choose-header">
        <h1>Welcome to RE:SOURCE</h1>

        <p>
          What would you like to do today?
          Choose how you want to contribute
          to a sustainable future.
        </p>
      </div>

      <div className="choose-cards">

        {options.map((option, index) => (

          <div className="choose-card" key={index}>

            <div className="choose-icon">
              {option.icon}
            </div>

            <h2>{option.title}</h2>

            <p>{option.description}</p>

            <Link to={option.path}>
              <button>{option.button} →</button>
            </Link>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ChooseAction;