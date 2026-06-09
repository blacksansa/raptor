export const metadata = {
  title: 'Bruno Santos — Portfolio',
  description: 'Portfolio criado com Next.js'
}

export default function RootLayout({ children }) {
  const css = `:root {
    --red: #CC0000;
    --red-dark: #8B0000;
    --red-light: #FF2222;
    --red-glow: #FF000033;
    --white: #FFFFFF;
    --off-white: #F5F0F0;
    --gray: #1A1A1A;
    --gray-mid: #2D2D2D;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #0D0D0D;
    color: var(--white);
    font-family: 'Rajdhani', sans-serif;
    overflow-x: hidden;
    cursor: none;
  }

  /* Custom cursor */
  .cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
  }
  .cursor svg { width: 100%; height: 100%; }
  .cursor-trail {
    position: fixed;
    width: 8px;
    height: 8px;
    background: var(--red);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: all 0.15s ease;
    opacity: 0.6;
  }

  /* Noise overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 100;
    opacity: 0.4;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0D0D0D; }
  ::-webkit-scrollbar-thumb { background: var(--red); }

  /* ===== HERO ===== */
  #hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 2rem;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 40%, #CC000015 0%, transparent 70%),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        #ffffff04 2px,
        #ffffff04 4px
      );
  }

  .scratch-lines {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .scratch-lines::before,
  .scratch-lines::after {
    content: '';
    position: absolute;
    background: linear-gradient(135deg, transparent 45%, var(--red-dark) 47%, var(--red) 50%, var(--red-dark) 53%, transparent 55%);
    opacity: 0.15;
  }
  .scratch-lines::before {
    width: 200%;
    height: 3px;
    top: 30%;
    left: -50%;
    transform: rotate(-8deg);
  }
  .scratch-lines::after {
    width: 200%;
    height: 2px;
    top: 32%;
    left: -50%;
    transform: rotate(-8deg);
  }

  /* Logo mark */
  .logo-mark {
    margin-bottom: 2rem;
    animation: logo-in 1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .logo-mark svg {
    width: 120px;
    height: 120px;
    filter: drop-shadow(0 0 30px #CC000060);
  }

  @keyframes logo-in {
    from { opacity: 0; transform: scale(0.5) rotate(-20deg); }
    to { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  .hero-name {
    font-family: 'Black Han Sans', sans-serif;
    font-size: clamp(4rem, 12vw, 9rem);
    font-weight: 400;
    line-height: 0.9;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    text-align: center;
    animation: name-in 1s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
    position: relative;
  }
  .hero-name .first { color: var(--white); display: block; }
  .hero-name .last {
    color: var(--red);
    display: block;
    -webkit-text-stroke: 2px var(--red);
  }

  @keyframes name-in {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero-tagline {
    margin-top: 1.5rem;
    font-family: 'Space Mono', monospace;
    font-size: clamp(0.7rem, 1.5vw, 0.9rem);
    color: #888;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    animation: fade-in 1s 0.5s both;
  }

  .hero-tagline span { color: var(--red); }

  .scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    animation: fade-in 1s 1s both;
  }
  .scroll-hint p {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: #555;
    text-transform: uppercase;
  }
  .scroll-arrow {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, var(--red), transparent);
    animation: scroll-pulse 2s ease-in-out infinite;
  }
  @keyframes scroll-pulse {
    0%, 100% { opacity: 0.3; transform: scaleY(1); }
    50% { opacity: 1; transform: scaleY(1.2); }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* ===== NAV ===== */
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    padding: 1.2rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to bottom, #0D0D0Ddd, transparent);
    backdrop-filter: blur(2px);
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .nav-logo svg { width: 28px; height: 28px; }
  .nav-logo-text {
    font-family: 'Black Han Sans', sans-serif;
    font-size: 1.1rem;
    color: var(--white);
    letter-spacing: 0.05em;
  }
  .nav-logo-text span { color: var(--red); }

  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
  }
  .nav-links a {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #888;
    text-decoration: none;
    transition: color 0.2s;
    position: relative;
  }
  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--red);
    transition: width 0.2s;
  }
  .nav-links a:hover { color: var(--white); }
  .nav-links a:hover::after { width: 100%; }

  /* ===== SECTIONS ===== */
  section {
    padding: 6rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    max-width: 60px;
    height: 1px;
    background: var(--red);
    opacity: 0.5;
  }

  .section-title {
    font-family: 'Black Han Sans', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 400;
    line-height: 1;
    color: var(--white);
    margin-bottom: 3rem;
  }
  .section-title span { color: var(--red); }

  /* ===== ABOUT ===== */
  #about {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .about-text p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #aaa;
    margin-bottom: 1rem;
  }
  .about-text p strong { color: var(--white); }

  .about-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 2rem;
  }
  .skill-tag {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    padding: 6px 12px;
    border: 1px solid #CC000060;
    color: var(--red);
    text-transform: uppercase;
    transition: all 0.2s;
  }
  .skill-tag:hover {
    background: var(--red);
    color: var(--white);
    border-color: var(--red);
  }

  .about-visual {
    position: relative;
    display: flex;
    justify-content: center;
  }
  .about-claw-bg {
    width: 300px;
    height: 300px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .about-claw-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid #CC000030;
    transform: rotate(12deg);
  }
  .about-claw-bg::after {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px solid #CC000020;
    transform: rotate(-5deg);
  }
  .about-claw-bg svg {
    width: 180px;
    height: 180px;
    opacity: 0.15;
    filter: drop-shadow(0 0 20px var(--red));
  }

  /* ===== PORTFOLIO ===== */
  #portfolio { padding-top: 2rem; }

  .portfolio-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .add-link-form {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .add-link-form input {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    background: #1A1A1A;
    border: 1px solid #CC000040;
    color: var(--white);
    padding: 10px 16px;
    letter-spacing: 0.05em;
    outline: none;
    width: 280px;
    transition: border-color 0.2s;
  }
  .add-link-form input::placeholder { color: #555; }
  .add-link-form input:focus { border-color: var(--red); }
  .add-link-form input.error { border-color: #FF4444; animation: shake 0.3s; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  .btn {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 10px 20px;
    border: 1px solid var(--red);
    background: transparent;
    color: var(--red);
    cursor: none;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--red);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s;
  }
  .btn:hover::before { transform: scaleX(1); }
  .btn:hover { color: var(--white); }
  .btn span { position: relative; z-index: 1; }

  /* ===== PREVIEW GRID ===== */
  #preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
  }

  .preview-card {
    position: relative;
    background: #111;
    border: 1px solid #CC000025;
    overflow: hidden;
    transition: all 0.3s;
    animation: card-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    cursor: none;
  }

  .preview-card:hover {
    border-color: var(--red);
    transform: translateY(-4px);
    box-shadow: 0 8px 40px #CC000030;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .preview-frame-wrap {
    position: relative;
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: #0A0A0A;
  }

  .preview-frame-wrap iframe {
    /* Position absolute so iframe never expands parent layout; shift left to hide native scrollbar. */
    position: absolute;
    top: 0;
    left: -40px;
    width: calc(100% / 0.29 + 80px);
    height: calc(220px / 0.29 + 80px);
    border: none !important;
    transform: scale(0.29);
    transform-origin: top left;
    pointer-events: none;
    display: block;
  }

  .preview-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, #111 100%);
    pointer-events: none;
  }

  .preview-loading {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: #0A0A0A;
    z-index: 2;
    transition: opacity 0.5s;
  }
  .preview-loading.hidden { opacity: 0; pointer-events: none; }

  .loader-claw {
    width: 40px;
    height: 40px;
    animation: claw-spin 1s linear infinite;
  }
  @keyframes claw-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: var(--red);
    text-transform: uppercase;
    animation: blink 1s ease-in-out infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .preview-info {
    padding: 1rem 1.2rem 1.2rem;
  }

  .preview-url {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: var(--red);
    letter-spacing: 0.05em;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .preview-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 4px;
    letter-spacing: 0.05em;
  }

  .preview-desc {
    font-size: 0.8rem;
    color: #666;
    line-height: 1.5;
    font-style: italic;
  }

  .preview-actions {
    display: flex;
    gap: 8px;
    margin-top: 1rem;
  }

  .btn-sm {
    font-family: 'Space Mono', monospace;
    font-size: 0.55rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 6px 12px;
    border: 1px solid #333;
    background: transparent;
    color: #888;
    cursor: none;
    text-decoration: none;
    transition: all 0.2s;
  }
  .btn-sm:hover { border-color: var(--red); color: var(--red); }
  .btn-sm.danger:hover { border-color: #FF4444; color: #FF4444; }

  /* Corner claw decoration */
  .card-claw {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    opacity: 0.12;
  }

  /* ===== EMPTY STATE ===== */
  #empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    border: 1px dashed #CC000030;
  }
  #empty-state svg {
    width: 80px;
    height: 80px;
    opacity: 0.2;
    margin: 0 auto 1.5rem;
    display: block;
  }
  #empty-state p {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: #555;
    text-transform: uppercase;
  }

  /* ===== CONTACT ===== */
  #contact-section {
    text-align: center;
    padding: 6rem 2rem;
    border-top: 1px solid #CC000020;
    max-width: 1200px;
    margin: 0 auto;
  }

  .contact-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }
  .contact-links a {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: #888;
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .contact-links a:hover { color: var(--red); }

  /* ===== FOOTER ===== */
  footer {
    padding: 2rem;
    text-align: center;
    border-top: 1px solid #1A1A1A;
  }
  footer p {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    color: #333;
    text-transform: uppercase;
  }
  footer p span { color: var(--red); }

  /* ===== DECORATIVE DIVIDER ===== */
  .claw-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0 auto 3rem;
    max-width: 1200px;
    padding: 0 2rem;
  }
  .claw-divider::before,
  .claw-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #CC000040, transparent);
  }
  .claw-divider svg {
    width: 24px;
    height: 24px;
    opacity: 0.4;
    flex-shrink: 0;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    #about { grid-template-columns: 1fr; }
    .about-visual { display: none; }
    .nav-links { display: none; }
    .add-link-form input { width: 200px; }
    #preview-grid { grid-template-columns: 1fr; }
  }
`;

  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Rajdhani:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
