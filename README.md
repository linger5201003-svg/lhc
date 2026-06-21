# lhc
新项目lhc

## 已安装的直播开奖视频插件

这个项目已经配置好一套可用于“六合彩直播开奖视频”的前端和视频制作插件：

| 用途 | 插件 |
| --- | --- |
| Web 前端开发 | `vite`, `@vitejs/plugin-react`, `typescript`, `react`, `react-dom` |
| HLS 直播播放器 | `video.js`, `@videojs/http-streaming`, `hls.js` |
| 开奖号码动画 | `gsap`, `framer-motion` |
| 实时开奖数据 | `socket.io-client` |
| OBS 推流控制 | `obs-websocket-js` |
| 视频生成/回放素材 | `remotion`, `@remotion/cli`, `@remotion/player` |
| 时间格式处理 | `dayjs` |

## 使用命令

```bash
npm install
npm run dev
```

打开 Vite 提供的地址即可查看直播开奖示例页面。

也可以打开 Remotion Studio 制作或预览开奖视频素材：

```bash
npm run remotion:studio
```

渲染示例开奖视频：

```bash
npm run remotion:render
```

## 可选环境变量

新建 `.env` 后可按需配置：

```bash
VITE_LIVE_HLS_URL=https://your-live-domain/live/stream.m3u8
VITE_DRAW_SOCKET_URL=wss://your-api-domain
VITE_OBS_WEBSOCKET_URL=ws://127.0.0.1:4455
VITE_OBS_WEBSOCKET_PASSWORD=your-obs-password
```

> 直播开奖内容请以官方发布信息为准，并确保符合当地法律法规和平台规则。
