import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Recycle,
  Truck,
  ShieldCheck,
  Users,
  ArrowRight,
  Leaf
} from "lucide-react";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero" id="home">

        <div className="hero-content">

          <span className="hero-tag">
            ♻ BUILDING A CIRCULAR FUTURE
          </span>

          <h1>
            Don't Waste It.
            <br />
            <span>RE:SOURCE It.</span>
          </h1>

          <p>
            A smarter platform connecting people and
            organizations to exchange, reuse and
            redistribute unused resources.
          </p>

          <div className="hero-buttons">
            <a href="/register" className="primary-btn">
              Get Started <ArrowRight size={18} />
            </a>

            <a href="#about" className="secondary-btn">
              Explore Platform
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <h2>100%</h2>
              <p>Resource Focused</p>
            </div>

            <div>
              <h2>24/7</h2>
              <p>Digital Platform</p>
            </div>

            <div>
              <h2>One</h2>
              <p>Sustainable Mission</p>
            </div>
          </div>

        </div>

        <div className="hero-visual">
          <div className="visual-circle">
            <Recycle size={120} strokeWidth={1.2} />
            <h2>RE:SOURCE</h2>
            <p>Reuse. Redistribute. Rebuild.</p>
          </div>
        </div>

      </section>

      <section className="about-section" id="about">

        <span className="section-tag">ABOUT RE:SOURCE</span>

        <h2>
          Resources deserve
          <span> a second life.</span>
        </h2>

        <p>
          RE:SOURCE is a centralized digital resource
          exchange ecosystem where individuals,
          businesses and organizations can make
          unused resources available to those who
          need them.
        </p>

      </section>

      <section className="features-section" id="features">

        <span className="section-tag">OUR ECOSYSTEM</span>

        <h2>One Platform. Multiple Possibilities.</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <Recycle size={35} />
            <h3>Resource Exchange</h3>
            <p>
              List unused resources and connect
              with people who need them.
            </p>
          </div>

          <div className="feature-card">
            <Users size={35} />
            <h3>Smart Matching</h3>
            <p>
              Connect resource providers with
              relevant seekers.
            </p>
          </div>

          <div className="feature-card">
            <ShieldCheck size={35} />
            <h3>Verified Resources</h3>
            <p>
              Improve trust through resource
              and organization verification.
            </p>
          </div>

          <div className="feature-card">
            <Truck size={35} />
            <h3>Centralized Logistics</h3>
            <p>
              Platform-managed pickup and
              delivery coordination.
            </p>
          </div>

          <div className="feature-card">
            <Leaf size={35} />
            <h3>Environmental Impact</h3>
            <p>
              Track reuse, redistribution
              and waste reduction.
            </p>
          </div>

        </div>

      </section>

      <section className="impact-section" id="impact">
        <h2>Make Every Resource Count.</h2>
        <p>
          Together, we can reduce waste and
          create a sustainable resource ecosystem.
        </p>

        <a href="/register" className="primary-btn">
          Join RE:SOURCE <ArrowRight size={18} />
        </a>
      </section>

      <Footer />
    </>
  );
}

export default Home;