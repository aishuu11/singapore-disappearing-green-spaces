import { useEffect, useRef, useState } from 'react'
import { Map, NavigationControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './App.css'

const mapLayers = {
  parks: {
    label: 'Parks & gardens',
    detail: 'NParks-managed green spaces',
    stat: '421 sites',
    accent: 'green',
    mapLayer: 'parks',
  },
  reserves: {
    label: 'Nature reserves',
    detail: 'Protected primary rainforest',
    stat: '4 reserves',
    accent: 'deep-green',
    mapLayer: 'reserves',
  },
  built: {
    label: 'Built-up areas',
    detail: 'The city edge around the green',
    stat: '61% of land',
    accent: 'rust',
    mapLayer: 'built',
  },
}

const mapData = {
  parks: {
    type: 'FeatureCollection',
    features: [
      [103.816, 1.352, 'Fort Canning Park'],
      [103.815, 1.305, 'Gardens by the Bay'],
      [103.869, 1.347, 'Bishan-Ang Mo Kio Park'],
      [103.738, 1.376, 'Bukit Batok Nature Park'],
      [103.967, 1.354, 'Pasir Ris Park'],
      [103.794, 1.335, 'Singapore Botanic Gardens'],
      [103.936, 1.363, 'Bedok Reservoir Park'],
    ].map(([longitude, latitude, name]) => ({
      type: 'Feature',
      properties: { name },
      geometry: { type: 'Point', coordinates: [longitude, latitude] },
    })),
  },
  reserves: {
    type: 'FeatureCollection',
    features: [
      [103.776, 1.362, 'Bukit Timah Nature Reserve'],
      [103.762, 1.383, 'Central Catchment Nature Reserve'],
      [103.719, 1.415, 'Sungei Buloh Wetland Reserve'],
      [103.832, 1.293, 'Labrador Nature Reserve'],
    ].map(([longitude, latitude, name]) => ({
      type: 'Feature',
      properties: { name },
      geometry: { type: 'Point', coordinates: [longitude, latitude] },
    })),
  },
  built: {
    type: 'FeatureCollection',
    features: [
      [
        [103.6, 1.2],
        [104.05, 1.2],
        [104.05, 1.48],
        [103.6, 1.48],
        [103.6, 1.2],
      ],
    ].map((coordinates) => ({
      type: 'Feature',
      properties: { name: 'Developed area' },
      geometry: { type: 'Polygon', coordinates: [coordinates] },
    })),
  },
}

function MapPanel({ activeLayer, selectedLayer }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const activeLayerRef = useRef(activeLayer)
  const [selectedPlace, setSelectedPlace] = useState(null)

  useEffect(() => {
    activeLayerRef.current = activeLayer
  }, [activeLayer])

  useEffect(() => {
    if (!mapContainer.current || map.current) return undefined

    map.current = new Map({
      container: mapContainer.current,
      center: [103.82, 1.35],
      zoom: 10.5,
      minZoom: 9,
      maxZoom: 15,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
          parks: { type: 'geojson', data: mapData.parks },
          reserves: { type: 'geojson', data: mapData.reserves },
          built: { type: 'geojson', data: mapData.built },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            paint: { 'raster-saturation': -0.85, 'raster-opacity': 0.62 },
          },
          {
            id: 'built',
            type: 'fill',
            source: 'built',
            paint: { 'fill-color': '#a94732', 'fill-opacity': 0.16 },
          },
          {
            id: 'built-outline',
            type: 'line',
            source: 'built',
            paint: { 'line-color': '#a94732', 'line-opacity': 0.7, 'line-width': 1.5 },
          },
          {
            id: 'parks',
            type: 'circle',
            source: 'parks',
            paint: {
              'circle-color': '#2d6542',
              'circle-radius': 7,
              'circle-stroke-color': '#f1f0e9',
              'circle-stroke-width': 2,
            },
          },
          {
            id: 'reserves',
            type: 'circle',
            source: 'reserves',
            paint: {
              'circle-color': '#174b2d',
              'circle-radius': 10,
              'circle-opacity': 0.86,
              'circle-stroke-color': '#f1f0e9',
              'circle-stroke-width': 2,
            },
          },
        ],
      },
    })

    map.current.addControl(new NavigationControl({ showCompass: false }), 'bottom-right')
    map.current.on('load', () => {
      map.current.setLayoutProperty('parks', 'visibility', activeLayerRef.current === 'parks' ? 'visible' : 'none')
      map.current.setLayoutProperty('reserves', 'visibility', activeLayerRef.current === 'reserves' ? 'visible' : 'none')
      map.current.setLayoutProperty('built', 'visibility', activeLayerRef.current === 'built' ? 'visible' : 'none')
      map.current.setLayoutProperty('built-outline', 'visibility', activeLayerRef.current === 'built' ? 'visible' : 'none')
    })
    map.current.on('click', 'parks', (event) => setSelectedPlace(event.features[0].properties.name))
    map.current.on('click', 'reserves', (event) => setSelectedPlace(event.features[0].properties.name))
    map.current.on('mouseenter', 'parks', () => { map.current.getCanvas().style.cursor = 'pointer' })
    map.current.on('mouseenter', 'reserves', () => { map.current.getCanvas().style.cursor = 'pointer' })
    map.current.on('mouseleave', 'parks', () => { map.current.getCanvas().style.cursor = '' })
    map.current.on('mouseleave', 'reserves', () => { map.current.getCanvas().style.cursor = '' })

    return () => {
      map.current.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return

    map.current.setLayoutProperty('parks', 'visibility', activeLayer === 'parks' ? 'visible' : 'none')
    map.current.setLayoutProperty('reserves', 'visibility', activeLayer === 'reserves' ? 'visible' : 'none')
    map.current.setLayoutProperty('built', 'visibility', activeLayer === 'built' ? 'visible' : 'none')
    map.current.setLayoutProperty('built-outline', 'visibility', activeLayer === 'built' ? 'visible' : 'none')
  }, [activeLayer])

  return (
    <div className="map-frame">
      <div ref={mapContainer} className="real-map" aria-label="Interactive map of Singapore green spaces" />
      <div className="map-frame__data">
        <span>{selectedLayer.label}</span>
        <strong>{selectedLayer.stat}</strong>
        <small>{selectedLayer.detail}</small>
      </div>
      <div className="map-frame__caption">
        <span>Drag to explore · scroll to zoom</span>
        <span>Singapore / 2025</span>
      </div>
      {selectedPlace && (
        <button className="map-frame__selection" type="button" onClick={() => setSelectedPlace(null)}>
          <span>Selected site</span>
          <strong>{selectedPlace}</strong>
          <small>Click to dismiss</small>
        </button>
      )}
    </div>
  )
}

function App() {
  const [activeLayer, setActiveLayer] = useState('parks')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0)
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.15 },
    )

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => {
      revealObserver.disconnect()
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  const selectedLayer = mapLayers[activeLayer]

  return (
    <main>
      <div className="scroll-progress" style={{ '--scroll-progress': `${scrollProgress}%` }} />
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
          <div className="hero__visual-header">
            <span>Live field guide</span>
            <span>01 — 03</span>
          </div>
          <div className="hero__island">
            <i className="hero__point hero__point--one" />
            <i className="hero__point hero__point--two" />
            <i className="hero__point hero__point--three" />
            <i className="hero__point hero__point--four" />
            <i className="hero__point hero__point--five" />
          </div>
          <div className="hero__legend">
            <span><i className="hero__legend-dot" /> Green space</span>
            <span><i className="hero__legend-line" /> City edge</span>
          </div>
          <div className="hero__coordinate">1°21&apos;N&nbsp; 103°49&apos;E</div>
          <div className="hero__map-note">Singapore<br />green-space atlas</div>
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

      <section className="story-intro reveal" aria-labelledby="story-intro-title">
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

      <section className="story-map reveal" id="story-map" aria-labelledby="map-title">
        <div className="story-map__copy">
          <div className="section-marker" aria-hidden="true">B</div>
          <p className="eyebrow">Chapter 01</p>
          <h2 id="map-title">A city mapped in green.</h2>
          <p className="section-note">
            Explore representative parks, nature reserves, and developed areas
            across Singapore. Drag the map, zoom in, and select a site.
          </p>
        </div>
        <div className={`map-placeholder map-placeholder--${selectedLayer.accent}`}>
          <MapPanel activeLayer={activeLayer} selectedLayer={selectedLayer} />
          <div className="map-placeholder__controls" aria-label="Map layers">
            {Object.entries(mapLayers).map(([key, layer]) => (
              <button
                className={activeLayer === key ? 'is-active' : ''}
                key={key}
                type="button"
                onClick={() => setActiveLayer(key)}
              >
                <span className={`layer-dot layer-dot--${layer.accent}`} />
                {layer.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="story-comparison reveal" aria-labelledby="comparison-title">
        <div className="section-marker" aria-hidden="true">C</div>
        <div className="story-comparison__heading">
          <p className="eyebrow">Chapter 02 · Access</p>
          <h2 id="comparison-title">Green is not evenly distributed.</h2>
          <p>Distance to a park changes depending on where the city starts for you.</p>
        </div>
        <div className="access-chart" aria-label="Illustrative park access comparison by region">
          {[
            ['Central', '82%', '1.2 km'],
            ['East', '68%', '1.6 km'],
            ['North', '61%', '1.9 km'],
            ['West', '54%', '2.3 km'],
          ].map(([region, access, distance]) => (
            <div className="access-chart__row" key={region}>
              <span>{region}</span>
              <div className="access-chart__bar"><i style={{ width: access }} /></div>
              <strong>{access}</strong>
              <small>{distance} avg.</small>
            </div>
          ))}
          <p className="chart-note">Illustrative comparison · replace with final population-distance dataset</p>
        </div>
      </section>

      <section className="story-change reveal" aria-labelledby="change-title">
        <div className="section-marker" aria-hidden="true">D</div>
        <div className="story-change__heading">
          <p className="eyebrow">Chapter 03 · Then / now</p>
          <h2 id="change-title">The edge keeps moving.</h2>
        </div>
        <div className="change-cards">
          <article className="change-card change-card--past">
            <span>2000</span>
            <div className="change-card__island" aria-hidden="true" />
            <strong>More continuous green</strong>
            <small>Forest edges reached deeper into the urban fabric.</small>
          </article>
          <div className="change-card__arrow" aria-hidden="true">→</div>
          <article className="change-card change-card--now">
            <span>2025</span>
            <div className="change-card__island" aria-hidden="true" />
            <strong>Smaller, vital pockets</strong>
            <small>Remaining spaces work harder for more people.</small>
          </article>
        </div>
      </section>

      <section className="story-timeline reveal" aria-labelledby="timeline-title">
        <div className="section-marker" aria-hidden="true">E</div>
        <div>
          <p className="eyebrow">Chapter 04 · A living timeline</p>
          <h2 id="timeline-title">Green space is a decision, not a leftover.</h2>
        </div>
        <ol className="timeline">
          <li><span>1965</span><strong>Island, city, garden</strong><p>Singapore’s first decades set a national ambition for a clean and green city.</p></li>
          <li><span>1990s</span><strong>Nature becomes infrastructure</strong><p>Reservoirs, park connectors, and protected areas begin linking the island.</p></li>
          <li><span>Today</span><strong>Every hectare counts</strong><p>New projects must negotiate between access, ecology, and growth.</p></li>
        </ol>
      </section>

      <footer className="story-footer">
        <div className="section-marker" aria-hidden="true">F</div>
        <div>
          <p className="eyebrow">Sources &amp; method</p>
          <h2>A map is a starting point.</h2>
          <p>Built as a visual prototype with representative locations. Connect the final version to NParks, URA, SingStat, and population datasets before publication.</p>
        </div>
        <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
      </footer>
    </main>
  )
}

export default App
