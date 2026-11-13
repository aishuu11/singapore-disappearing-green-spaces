import './App.css'

function App() {
  return (
    <main>
      <header className="hero">
        <nav className="topbar" aria-label="Story navigation">
          <a className="wordmark" href="#top">
            FIELD<span>/</span>NOTES
          </a>
          <p className="topbar__issue">SG / ENVIRONMENT / 01</p>
          <a className="topbar__link" href="#story-map">
            Explore story <span aria-hidden="true">↘</span>
          </a>
        </nav>

        <div className="hero__visual" aria-hidden="true">
          <div className="contour contour--one" />
          <div className="contour contour--two" />
          <div className="contour contour--three" />
          <div className="hero__coordinate">1°21&apos;N&nbsp; 103°49&apos;E</div>
          <div className="hero__stamp">LAND<br />/ WATER<br />/ CITY</div>
        </div>

        <div className="hero__content" id="top">
          <p className="eyebrow">A data story about land and belonging</p>
          <h1>
            The <em>green</em> between us.
          </h1>
          <p className="intro">
            Singapore is building, growing, and making room. Look closer at
            the parks, reserves, and open spaces woven through the city.
          </p>
          <a className="scroll-cue" href="#story-intro">
            <span className="scroll-cue__number">01</span>
            Start with the landscape
            <span className="scroll-cue__arrow" aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="hero__credit">Words &amp; data · Singapore · 2026</p>
      </header>

      <section className="story-intro" aria-labelledby="story-intro-title">
        <div className="section-marker" aria-hidden="true">A</div>
        <div>
          <p className="eyebrow">The question</p>
          <h2 id="story-intro-title">
            How much green space does Singapore have—and who gets to live near
            it?
          </h2>
          <p>
            We are looking beyond a simple count of parks. By combining
            official park boundaries, planning areas, land-use zones, and
            population data, this story traces the relationship between the
            city and its remaining green.
          </p>
        </div>
      </section>

      <section className="story-map" id="story-map" aria-labelledby="map-title">
        <div className="story-map__copy">
          <div className="section-marker" aria-hidden="true">B</div>
          <p className="eyebrow">Chapter 01</p>
          <h2 id="map-title">A city mapped in green.</h2>
          <p className="section-note">
            The interactive map will show NParks-managed parks and nature
            reserves across Singapore.
          </p>
        </div>
        <div className="map-placeholder" aria-label="Map visualization coming next">
          <span className="map-placeholder__label">The map comes next</span>
          <span className="map-placeholder__grid" aria-hidden="true" />
          <small>NParks managed areas / 2025</small>
        </div>
      </section>
    </main>
  )
}

export default App
