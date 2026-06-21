import {AbsoluteFill, Composition, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CSSProperties} from 'react';

import {
  RealFootageCustomDraw,
  realFootageCustomDrawDefaults,
} from './RealFootageCustomDraw';
import {StudioLotteryVideo} from './StudioLotteryVideo';

const drawNumbers = [3, 12, 18, 24, 32, 41, 49];

export function RemotionRoot() {
  return (
    <>
      <Composition
        component={LotteryDraw}
        durationInFrames={180}
        fps={30}
        height={1080}
        id="LotteryDraw"
        width={1920}
      />
      <Composition
        component={StudioLotteryVideo}
        durationInFrames={360}
        fps={30}
        height={1080}
        id="StudioLotteryLiveDraw"
        width={1920}
      />
      <Composition
        component={RealFootageCustomDraw}
        defaultProps={realFootageCustomDrawDefaults}
        durationInFrames={360}
        fps={30}
        height={1080}
        id="RealFootageCustomDraw"
        width={1920}
      />
    </>
  );
}

function LotteryDraw() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={styles.stage}>
      <div style={{...styles.glow, opacity: titleOpacity}} />
      <div style={{...styles.header, opacity: titleOpacity}}>
        <span style={styles.badge}>LIVE DRAW</span>
        <h1 style={styles.title}>六合彩开奖直播</h1>
        <p style={styles.subtitle}>第 20260621-001 期</p>
      </div>
      <div style={styles.balls}>
        {drawNumbers.map((number, index) => {
          const progress = spring({
            frame: frame - index * 9 - 28,
            fps,
            config: {
              damping: 13,
              mass: 0.7,
              stiffness: 120,
            },
          });

          return (
            <div
              key={number}
              style={{
                ...styles.ball,
                ...(index === drawNumbers.length - 1 ? styles.specialBall : {}),
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [120, 0])}px) scale(${progress})`,
              }}
            >
              {number}
            </div>
          );
        })}
      </div>
      <div style={styles.footer}>开奖结果以官方发布为准</div>
    </AbsoluteFill>
  );
}

const styles: Record<string, CSSProperties> = {
  stage: {
    alignItems: 'center',
    background:
      'radial-gradient(circle at 20% 10%, rgba(245,158,11,.32), transparent 520px), linear-gradient(135deg, #101827 0%, #08111f 58%, #24071f 100%)',
    color: '#fff',
    fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: {
    background: 'radial-gradient(circle, rgba(239,68,68,.32), transparent 62%)',
    height: 920,
    position: 'absolute',
    right: -180,
    top: -220,
    width: 920,
  },
  header: {
    textAlign: 'center',
  },
  badge: {
    background: '#f59e0b',
    borderRadius: 999,
    color: '#111827',
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: 8,
    padding: '14px 32px',
  },
  title: {
    fontSize: 132,
    lineHeight: 1,
    margin: '46px 0 20px',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 44,
    margin: 0,
  },
  balls: {
    display: 'flex',
    gap: 34,
    marginTop: 78,
  },
  ball: {
    alignItems: 'center',
    background: 'linear-gradient(135deg, #fff7ed, #fecaca)',
    border: '10px solid rgba(255,255,255,.58)',
    borderRadius: '50%',
    boxShadow: '0 26px 60px rgba(0,0,0,.34)',
    color: '#991b1b',
    display: 'flex',
    fontSize: 58,
    fontWeight: 1000,
    height: 150,
    justifyContent: 'center',
    width: 150,
  },
  specialBall: {
    background: 'linear-gradient(135deg, #fde68a, #f97316)',
    color: '#431407',
  },
  footer: {
    bottom: 58,
    color: '#94a3b8',
    fontSize: 30,
    position: 'absolute',
  },
};
