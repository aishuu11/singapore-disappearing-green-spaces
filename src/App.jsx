import './App.css'

function App() {
  return (
    <main>
      <header className="hero">
        <div className="hero__texture" aria-hidden="true">
          <span className="hero__leaf hero__leaf--one" />
          <span className="hero__leaf hero__leaf--two" />
          <span className="hero__leaf hero__leaf--three" />
        </div>
        <div className="hero__content">
          <p className="eyebrow">Singapore environmental data story</p>
          <h1>Singapore&apos;s green spaces are changing.</h1>
          <p className="intro">
            Parks, nature reserves, and open spaces sit alongside one of the
            world&apos;s most densely developed cities. This story explores what
            is protected, what is planned, and who has access to it.
          </p>
          <a className="scroll-cue" href="#story-map">
            <span className="scroll-cue__line" aria-hidden="true" />
            Begin exploring
          </a>
        </div>
        <p className="hero__credit">An interactive data story · 2026</p>
      </header>

      <section className="story-intro" aria-labelledby="story-intro-title">
        <p className="eyebrow">The question</p>
        <h2 id="story-intro-title">
          How much green space does Singapore have—and how is it distributed?
        </h2>
        <p>
          We will combine official park boundaries, planning areas, land-use
          zones, and population data to look beyond a simple count of parks.
        </p>
      </section>

      <section className="story-map" id="story-map" aria-labelledby="map-title">
        <div>
          <p className="eyebrow">Chapter 01</p>
          <h2 id="map-title">A city mapped in green</h2>
          <p className="section-note">
            The interactive map will show NParks-managed parks and nature
            reserves across Singapore.
          </p>
        </div>
        <div className="map-placeholder" aria-label="Map visualization coming next">
          <span>Map visualization</span>
          <small>Data layer coming next</small>
        </div>
      </section>
    </main>
  )
}

export default App
