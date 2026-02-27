import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="page home-page">
      <h1>Pheydrus Calculator</h1>
      <p className="subtitle">Break life patterns for good.</p>

      <div className="features">
        <div className="feature-card">
          <h3>Accurate Calculations</h3>
          <p>Swiss Ephemeris-powered astrology and Chaldean numerology</p>
        </div>
        <div className="feature-card">
          <h3>Easy to Use</h3>
          <p>Simple interface designed for efficiency</p>
        </div>
        <div className="feature-card">
          <h3>Always Available</h3>
          <p>Access your calculations anytime, anywhere</p>
        </div>
      </div>

      <Link to="/calculator" className="cta-button">
        Enter
      </Link>
    </div>
  );
}

export default HomePage;
