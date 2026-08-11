# Dream Hill Hotel Signage

Production-ready portrait digital signage for Dream Hill Business Deluxe Hotel.

## Ready-to-use build

The compiled display is committed in [`dist/`](./dist/).

- To run it locally, open `dist/index.html` in a modern browser and enter fullscreen/kiosk mode.
- To deploy it, upload the complete contents of `dist/` to any static host. Keep the `assets/` folder next to `index.html`.
- The application JavaScript and CSS are embedded in `index.html`; the local hotel logo and room-image fallbacks live in `dist/assets/dream-hill/`.

The live EUR/TRY rate needs internet access. If the rate service is temporarily unavailable, the display uses the last successfully cached rate and continues rendering.

## Development

```bash
npm install
npm run dev
```

Rebuild the deployable files after source changes:

```bash
npm run build
```

Run the checks:

```bash
npm test
npm run typecheck
```
