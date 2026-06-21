# AGENTS.md

## Cursor Cloud specific instructions

This repo (`lhc`) is a Vite + React 19 + Remotion toolkit for producing **六合彩 (Mark Six lottery) live-draw videos**. It is a video-production tool: custom numbers are for demo/video rendering only and the UI/templates carry disclaimers that they are not official results. Do not turn it into something that impersonates official draw results.

### Services / entry points
- **Vite web app** (`npm run dev`): interactive front-end with an HLS live-player panel, a GSAP draw-number animation panel (button `模拟下一期开奖结果` regenerates numbers), and an OBS-WebSocket test panel. Served at `http://0.0.0.0:5173` (host binding is already set in `vite.config.ts`).
- **Remotion** (`src/remotion/`): video compositions registered in `src/remotion/index.ts` (`LotteryDraw`, `StudioLotteryLiveDraw`, `RealFootageCustomDraw`). Render via the `remotion:render*` scripts in `package.json`, or open `npm run remotion:studio` for an interactive preview server.

### Standard commands (see `package.json` scripts)
- Type-check / "lint": `npm run check` (there is **no ESLint**; `tsc --noEmit` is the only static check).
- Build: `npm run build` (runs `tsc --noEmit` then `vite build`).
- Dev server: `npm run dev`.
- Render a video: e.g. `npm run remotion:render:no-animation` or pass custom props:
  `npx remotion render src/remotion/index.ts RealFootageCustomDraw out/x.mp4 --props='{"numbers":[5,11,19,26,33,40,49],"period":"20260621-001"}'`

### Non-obvious notes
- Remotion rendering needs a Chromium browser. The Cloud VM already provides `google-chrome` on PATH, and Remotion otherwise downloads its own Chrome Headless Shell on first render. `ffmpeg` is preinstalled and used for encoding. Rendered files go to `out/` (gitignored).
- All env vars are optional (`VITE_LIVE_HLS_URL`, `VITE_DRAW_SOCKET_URL`, `VITE_OBS_WEBSOCKET_URL`, `VITE_OBS_WEBSOCKET_PASSWORD`). With none set, the web app falls back to a public demo HLS stream and demo draw data, so it runs fully without any secrets. The socket.io live channel and OBS control are inert until their URLs are configured.
- The real application code currently lives on the `cursor/install-live-video-plugins-5aa2` branch; the `main` branch only has the README.
