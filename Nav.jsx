// Nav.jsx
const { useState } = React;

function Nav({ route, setRoute, theme, toggleTheme }) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#/" onClick={(e) => { e.preventDefault(); setRoute('home'); }} className="brand">
          <img src="logo-96.png" alt="" className="brand-mark-img" width="32" height="32" />
          <span>dclaw</span>
          <span className="brand-version">v0.3.0-beta.2</span>
        </a>
        <div className="nav-links">
          <a href="#/" onClick={(e) => { e.preventDefault(); setRoute('home'); }}
             className={`nav-link ${route === 'home' ? 'active' : ''}`}>Overview</a>
          <a href="#/architecture" onClick={(e) => { e.preventDefault(); setRoute('architecture'); }}
             className={`nav-link ${route === 'architecture' ? 'active' : ''}`}>Architecture</a>
          <a href="#/docs" onClick={(e) => { e.preventDefault(); setRoute('docs'); }}
             className={`nav-link ${route === 'docs' ? 'active' : ''}`}>Docs</a>
          <a href="#/changelog" onClick={(e) => { e.preventDefault(); setRoute('changelog'); }}
             className={`nav-link ${route === 'changelog' ? 'active' : ''}`}>Changelog</a>
        </div>
        <div className="nav-right">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'switch to light mode' : 'switch to dark mode'}
            title={theme === 'dark' ? 'light mode' : 'dark mode'}
          >
            {theme === 'dark' ? (
              // sun
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            ) : (
              // moon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <a href="https://github.com/itsmehatef/dclaw" target="_blank" rel="noopener" className="nav-cta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.1 2 3 1.4 3.7 1.1.1-.8.5-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 011.3-3.3c-.1-.3-.6-1.7.1-3.5 0 0 1-.3 3.4 1.3a11.8 11.8 0 016.2 0c2.3-1.6 3.4-1.3 3.4-1.3.6 1.8.2 3.2.1 3.5.8.9 1.3 2 1.3 3.3 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

window.Nav = Nav;
