# Asset provenance

This prototype uses three visual layers:

- `public/assets/wonderblocks-official/`: official Wonderblocks character images downloaded from Blocks Universe / learningblocks.tv pages for local prototype reference.
- `public/assets/wonderblocks-source/`: YouTube thumbnails downloaded from the official Wonderblocks channel with `yt-dlp`; used as source/reference imagery.
- Inline SVG mascots in `src/App.jsx`: original playable token drawings created for the course UI so the board has consistent, small, animatable pieces.

Primary pages inspected:

- https://www.learningblocks.tv/wonderblocks/how-it-works
- https://www.learningblocks.tv/wonderblocks/episodes
- https://www.learningblocks.tv/wonderblocks/home
- https://www.youtube.com/@WonderblocksOfficial

Current official character assets present, audited on a checkerboard (output/playwright/art-pass/00-asset-audit.png):

- Transparent character cutouts (usable as sprites): `go.avif`, `stop.avif`, `group-stop-go.avif`, `hop.avif`.
- Rectangular episode stills (scenes, NOT sprites): `again.avif`, `moo.avif`, `cluck.avif`, `splat-purple.avif`, `move.avif`. These are only shown as episode artwork in the story gate, never as board tokens or command icons.

Board/tile/command artwork (cow, hen, brush, loop arrow, puddles, hedges, target pad, collectibles, clock, signal, scenery: sun/clouds/trees/bushes/flowers) is original inline SVG in `src/BoardArt.jsx`.

The app does not claim ownership of Wonderblocks assets. For public/commercial distribution, replace these with licensed assets or keep only the original vector tokens.
