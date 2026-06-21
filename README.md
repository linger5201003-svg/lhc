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

默认会生成：

```text
out/studio-lottery-live-draw.mp4
```

这个视频模板使用 `public/studio-background.png` 作为演播室背景，并在摇奖机圆筒区域叠加 47 个带高光、阴影和编号的真实感号码球，随后依次摇出 7 个号码到顶部开奖框。若要严格使用自己的演播室原图，请把图片覆盖保存为：

```text
public/studio-background.png
```

然后重新运行：

```bash
npm run remotion:render
```

保留的简版开奖视频命令：

```bash
npm run remotion:render:simple
```

## 无动画 / 真实素材模式

如果要求“不要有任何动画，包括摇奖球”，请使用 `RealFootageCustomDraw` 模板：

```bash
npm run remotion:render:no-animation
```

这个模板不会生成摇奖球、不会生成摇奖过程动画，只会在画面上静态叠加期号和开奖号码。默认输出：

```text
out/real-footage-custom-draw.mp4
```

自定义开奖号码示例：

```bash
npm run remotion:render:no-animation:demo
```

也可以直接传入号码和期号：

```bash
npx remotion render src/remotion/index.ts RealFootageCustomDraw out/real-footage-custom-draw.mp4 \
  --props='{"numbers":[3,8,16,22,29,35,47],"period":"20260621-002"}'
```

如需使用真实开奖直播过程，请把你拥有授权的真实录像放到 `public/` 目录，例如：

```text
public/real-live-draw.mp4
```

然后运行：

```bash
npx remotion render src/remotion/index.ts RealFootageCustomDraw out/real-footage-custom-draw.mp4 \
  --props='{"sourceVideo":"real-live-draw.mp4","numbers":[3,8,16,22,29,35,47],"period":"20260621-002"}'
```

注意：没有真实授权录像素材时，本项目不会伪造“真实开奖直播过程”。自定义号码仅用于视频制作展示，不能冒充官方开奖结果。

## 可选环境变量

新建 `.env` 后可按需配置：

```bash
VITE_LIVE_HLS_URL=https://your-live-domain/live/stream.m3u8
VITE_DRAW_SOCKET_URL=wss://your-api-domain
VITE_OBS_WEBSOCKET_URL=ws://127.0.0.1:4455
VITE_OBS_WEBSOCKET_PASSWORD=your-obs-password
```

> 直播开奖内容请以官方发布信息为准，并确保符合当地法律法规和平台规则。
