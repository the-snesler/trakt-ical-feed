import { BrandIcon, Icons, brandIconStyles } from "./icons";

export const Footer = () => (
  <footer class="footer">
    <div class="footer-links">
      <a
        class="footer-link"
        href="https://github.com/the-snesler/trakt-ical-feed"
        target="_blank"
        rel="noopener noreferrer"
      >
        <BrandIcon icon={Icons.github} size={16} />
        <span>Source</span>
      </a>
      <a
        class="footer-link"
        href="https://samnesler.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          class="footer-glyph"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>samnesler.com</span>
      </a>
      <a
        class="footer-link"
        href="https://app.trakt.tv/profile/oncetsuni"
        target="_blank"
        rel="noopener noreferrer"
      >
        <BrandIcon icon={Icons.trakt} size={16} />
        <span>oncetsuni</span>
      </a>
    </div>
    <p class="footer-note">Built by Sam Nesler. Not affiliated with Trakt.</p>
  </footer>
);

export const footerStyles = `
${brandIconStyles}
  .footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #222;
    text-align: center;
  }
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem 1.5rem;
    margin-bottom: 0.75rem;
  }
  .footer-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #999;
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.15s ease;
  }
  .footer-link:hover { color: #e0e0e0; }
  .footer-glyph {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  .footer-note {
    color: #666;
    font-size: 0.75rem;
  }
`;
