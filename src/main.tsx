import '@videojs/http-streaming';
import 'video.js/dist/video-js.css';

import {motion} from 'framer-motion';
import gsap from 'gsap';
import Hls from 'hls.js';
import OBSWebSocket from 'obs-websocket-js';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {io} from 'socket.io-client';
import videojs from 'video.js';

import './styles.css';

type DrawPayload = {
  period: string;
  numbers: number[];
  special: number;
  openedAt: string;
};

const demoDraw: DrawPayload = {
  period: '20260621-001',
  numbers: [3, 12, 18, 24, 32, 41],
  special: 49,
  openedAt: new Date().toISOString(),
};

const liveStreamUrl =
  import.meta.env.VITE_LIVE_HLS_URL ??
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const socketUrl = import.meta.env.VITE_DRAW_SOCKET_URL;
const obsUrl = import.meta.env.VITE_OBS_WEBSOCKET_URL;
const obsPassword = import.meta.env.VITE_OBS_WEBSOCKET_PASSWORD;

function LotteryLiveApp() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ballRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [currentDraw, setCurrentDraw] = useState<DrawPayload>(demoDraw);
  const [obsStatus, setObsStatus] = useState('未连接');

  const hlsStatus = useMemo(() => {
    if (Hls.isSupported()) {
      return 'HLS.js 支持当前浏览器';
    }

    return '当前浏览器可尝试原生 HLS 播放';
  }, []);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const player = videojs(videoRef.current, {
      autoplay: false,
      controls: true,
      fluid: true,
      liveui: true,
      preload: 'auto',
      sources: [
        {
          src: liveStreamUrl,
          type: 'application/x-mpegURL',
        },
      ],
    });

    return () => {
      player.dispose();
    };
  }, []);

  useEffect(() => {
    const activeBalls = ballRefs.current.filter(Boolean);

    gsap.fromTo(
      activeBalls,
      {opacity: 0, scale: 0.65, y: 18},
      {opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.8)', stagger: 0.08},
    );
  }, [currentDraw]);

  useEffect(() => {
    if (!socketUrl) {
      return;
    }

    const socket = io(socketUrl, {
      transports: ['websocket'],
    });

    socket.on('draw:update', (payload: DrawPayload) => {
      setCurrentDraw(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const connectObs = async () => {
    if (!obsUrl) {
      setObsStatus('请先配置 VITE_OBS_WEBSOCKET_URL');
      return;
    }

    try {
      const obs = new OBSWebSocket();
      await obs.connect(obsUrl, obsPassword);
      const version = await obs.call('GetVersion');
      setObsStatus(`已连接 OBS ${version.obsVersion}`);
      await obs.disconnect();
    } catch (error) {
      setObsStatus(error instanceof Error ? error.message : 'OBS 连接失败');
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">LHC Live Draw Toolkit</p>
          <h1>六合彩直播开奖视频插件已就绪</h1>
          <p className="intro">
            已集成直播播放器、开奖动画、实时数据通道、OBS 控制和 Remotion 视频生成入口。
          </p>
        </div>
        <motion.div
          className="status-card"
          initial={{opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.45}}
        >
          <span>当前期号</span>
          <strong>{currentDraw.period}</strong>
          <small>{new Date(currentDraw.openedAt).toLocaleString('zh-CN')}</small>
        </motion.div>
      </section>

      <section className="grid">
        <article className="panel video-panel">
          <div className="panel-heading">
            <h2>直播视频</h2>
            <span>{hlsStatus}</span>
          </div>
          <video ref={videoRef} className="video-js vjs-big-play-centered" playsInline />
        </article>

        <article className="panel draw-panel">
          <div className="panel-heading">
            <h2>开奖直播号码</h2>
            <span>socket.io 事件：draw:update</span>
          </div>
          <div className="balls">
            {[...currentDraw.numbers, currentDraw.special].map((number, index) => (
              <div
                className={index === currentDraw.numbers.length ? 'ball special' : 'ball'}
                key={`${currentDraw.period}-${number}-${index}`}
                ref={(element) => {
                  ballRefs.current[index] = element;
                }}
              >
                {number}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setCurrentDraw(randomDraw())}>
            模拟下一期开奖结果
          </button>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h2>OBS 推流控制</h2>
            <span>obs-websocket-js</span>
          </div>
          <p>
            配置 <code>VITE_OBS_WEBSOCKET_URL</code> 后可从页面测试 OBS WebSocket 连接。
          </p>
          <button type="button" onClick={connectObs}>
            测试 OBS 连接
          </button>
          <p className="status-line">{obsStatus}</p>
        </article>
      </section>
    </main>
  );
}

function randomDraw(): DrawPayload {
  const pool = Array.from({length: 49}, (_, index) => index + 1);
  const numbers = Array.from({length: 7}, () => {
    const nextIndex = Math.floor(Math.random() * pool.length);
    const [next] = pool.splice(nextIndex, 1);
    return next;
  });

  return {
    period: `demo-${Date.now()}`,
    numbers: numbers.slice(0, 6).sort((a, b) => a - b),
    special: numbers[6],
    openedAt: new Date().toISOString(),
  };
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LotteryLiveApp />
  </React.StrictMode>,
);
