import React from 'react';
import '../styling/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🌐 Social Hub</h3>
          <p>Connect, Share, Inspire</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/user">Profile</a>
            <a href="/about">About Us</a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="social-icons">
            <span>📧</span>
            <span>💬</span>
            <span>🐦</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {currentYear} Social Hub. All rights reserved | Made with ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
