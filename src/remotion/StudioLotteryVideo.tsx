import type {CSSProperties} from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';

type Ball = {
  color: string;
  id: number;
  seed: number;
};

const totalBalls = 47;
const drawNumbers = [6, 12, 18, 24, 31, 38, 47];
const colors = [
  'radial-gradient(circle at 34% 24%, #fff 0 6%, #ffd8d8 16%, #ef4444 52%, #7f1d1d 100%)',
  'radial-gradient(circle at 34% 24%, #fff 0 6%, #dbeafe 17%, #2563eb 54%, #172554 100%)',
  'radial-gradient(circle at 34% 24%, #fff 0 6%, #dcfce7 17%, #22c55e 54%, #14532d 100%)',
  'radial-gradient(circle at 34% 24%, #fff 0 6%, #fef3c7 17%, #f59e0b 54%, #78350f 100%)',
];
const balls: Ball[] = Array.from({length: totalBalls}, (_, index) => ({
  color: colors[index % colors.length],
  id: index + 1,
  seed: seeded(index + 1),
}));
const slotCenters = [390, 528, 665, 803, 941, 1078, 1216];
const chamberCenter = {x: 822, y: 500};
const chamberRadius = 226;
const startShakeFrame = 35;
const firstDrawFrame = 160;
const drawInterval = 34;

export function StudioLotteryVideo() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={styles.stage}>
      <Img src={staticFile('studio-background.png')} style={styles.background} />
      <div style={styles.vignette} />
      <div style={styles.broadcastBug}>开奖现场 SIMULATION</div>
      <div style={styles.titleBar}>
        <span>SEA MARK SIX</span>
        <strong>六合彩开奖直播</strong>
      </div>
      <ResultSlots />
      <LotteryChamber frame={frame} />
      <DrawnBalls frame={frame} />
      <LowerThird frame={frame} />
    </AbsoluteFill>
  );
}

function LotteryChamber({frame}: {frame: number}) {
  const shake = frame < startShakeFrame ? 0 : Math.min((frame - startShakeFrame) / 50, 1);

  return (
    <div style={styles.chamberMask}>
      <div
        style={{
          ...styles.chamberShakeLayer,
          transform: `translate(${Math.sin(frame * 0.55) * 8 * shake}px, ${
            Math.cos(frame * 0.48) * 6 * shake
          }px) rotate(${Math.sin(frame * 0.28) * 1.2 * shake}deg)`,
        }}
      >
        {balls.map((ball) => {
          const drawIndex = drawNumbers.indexOf(ball.id);
          if (drawIndex >= 0 && frame > firstDrawFrame + drawIndex * drawInterval) {
            return null;
          }
          const position = getBallPosition(ball, frame, shake);

          return (
            <NumberBall
              ball={ball}
              key={ball.id}
              size={44}
              style={{
                left: position.x,
                top: position.y,
                transform: `scale(${position.scale}) rotate(${position.rotation}deg)`,
                zIndex: position.zIndex,
              }}
            />
          );
        })}
      </div>
      <div style={styles.chamberGlass} />
      <div style={styles.chamberReflection} />
    </div>
  );
}

function DrawnBalls({frame}: {frame: number}) {
  return (
    <>
      {drawNumbers.map((number, index) => {
        const start = firstDrawFrame + index * drawInterval;
        if (frame < start) {
          return null;
        }
        const progress = Math.min(
          Math.max(
            spring({
              config: {damping: 18, mass: 0.65, stiffness: 95},
              fps: 30,
              frame: frame - start,
            }),
            0,
          ),
          1,
        );
        const arc = Math.sin(progress * Math.PI) * 120;
        const x = interpolate(progress, [0, 0.35, 1], [chamberCenter.x, 630 + index * 56, slotCenters[index]]);
        const y = interpolate(progress, [0, 0.35, 1], [chamberCenter.y - 16, 300 - arc, 104]);
        const ball = balls[number - 1];

        return (
          <NumberBall
            ball={ball}
            key={number}
            size={78}
            style={{
              left: x - 39,
              opacity: progress,
              top: y - 39,
              transform: `rotate(${interpolate(progress, [0, 1], [0, 720])}deg) scale(${0.85 + progress * 0.15})`,
              zIndex: 50 + index,
            }}
          />
        );
      })}
    </>
  );
}

function ResultSlots() {
  return (
    <div style={styles.slotLayer}>
      {slotCenters.map((left, index) => (
        <div key={left} style={{...styles.slot, left: left - 53}}>
          <span>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function LowerThird({frame}: {frame: number}) {
  const opacity = interpolate(frame, [0, 30, 300, 340], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentIndex = Math.min(drawNumbers.length, Math.max(0, Math.floor((frame - firstDrawFrame + 12) / drawInterval) + 1));

  return (
    <div style={{...styles.lowerThird, opacity}}>
      <span>第 20260621-001 期</span>
      <strong>
        {currentIndex > 0 ? `正在开奖：${drawNumbers.slice(0, currentIndex).join('  ')}` : '47 个真实感号码球正在混合'}
      </strong>
      <small>演示视频，开奖结果以官方发布为准</small>
    </div>
  );
}

function NumberBall({ball, size, style}: {ball: Ball; size: number; style?: CSSProperties}) {
  return (
    <div style={{...styles.ball, background: ball.color, height: size, width: size, ...style}}>
      <div style={styles.ballHighlight} />
      <div style={styles.ballNumber}>{ball.id}</div>
      <div style={styles.ballShadow} />
    </div>
  );
}

function getBallPosition(ball: Ball, frame: number, shake: number) {
  const orbit = frame * (0.035 + ball.seed * 0.036) + ball.seed * Math.PI * 9;
  const radius = 34 + ((ball.seed * 1000) % 1) * (chamberRadius - 68);
  const turbulence = Math.sin(frame * 0.19 + ball.seed * 12) * 38 * shake;
  const x = chamberRadius + Math.cos(orbit) * (radius + turbulence) - 22;
  const y =
    chamberRadius +
    Math.sin(orbit * 1.16) * (radius * 0.76 + turbulence * 0.45) +
    Math.cos(frame * 0.13 + ball.seed * 8) * 24 * shake -
    22;

  return {
    rotation: frame * (3 + ball.seed * 9),
    scale: 0.8 + ball.seed * 0.45,
    x: Math.min(Math.max(x, 24), chamberRadius * 2 - 68),
    y: Math.min(Math.max(y, 28), chamberRadius * 2 - 72),
    zIndex: Math.round(10 + ball.seed * 20),
  };
}

function seeded(value: number) {
  const x = Math.sin(value * 999) * 10000;
  return x - Math.floor(x);
}

const styles: Record<string, CSSProperties> = {
  background: {height: '100%', objectFit: 'cover', width: '100%'},
  ball: {
    alignItems: 'center',
    border: '2px solid rgba(255,255,255,.72)',
    borderRadius: '50%',
    boxShadow: 'inset -10px -14px 20px rgba(0,0,0,.38), inset 8px 8px 18px rgba(255,255,255,.3), 0 10px 18px rgba(0,0,0,.38)',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
  },
  ballHighlight: {
    background: 'radial-gradient(circle, rgba(255,255,255,.9), rgba(255,255,255,.15) 52%, transparent 64%)',
    borderRadius: '50%',
    height: '32%',
    left: '19%',
    position: 'absolute',
    top: '14%',
    width: '32%',
  },
  ballNumber: {
    alignItems: 'center',
    background: 'rgba(255,255,255,.86)',
    borderRadius: '50%',
    color: '#101827',
    display: 'flex',
    fontSize: '46%',
    fontWeight: 1000,
    height: '54%',
    justifyContent: 'center',
    position: 'relative',
    width: '54%',
  },
  ballShadow: {
    background: 'radial-gradient(ellipse, rgba(0,0,0,.35), transparent 66%)',
    bottom: '-18%',
    height: '28%',
    position: 'absolute',
    width: '76%',
  },
  broadcastBug: {
    background: 'rgba(5,12,28,.72)',
    border: '1px solid rgba(255,255,255,.2)',
    borderRadius: 999,
    color: '#fbbf24',
    fontSize: 23,
    fontWeight: 900,
    letterSpacing: 2,
    padding: '12px 24px',
    position: 'absolute',
    right: 48,
    top: 38,
  },
  chamberGlass: {
    background: 'radial-gradient(circle at 34% 23%, rgba(255,255,255,.22), transparent 18%), radial-gradient(circle, transparent 58%, rgba(255,255,255,.28) 62%, transparent 70%)',
    border: '10px solid rgba(255,255,255,.24)',
    borderRadius: '50%',
    inset: 0,
    position: 'absolute',
  },
  chamberMask: {
    borderRadius: '50%',
    height: chamberRadius * 2,
    left: chamberCenter.x - chamberRadius,
    overflow: 'hidden',
    position: 'absolute',
    top: chamberCenter.y - chamberRadius,
    width: chamberRadius * 2,
  },
  chamberReflection: {
    background: 'linear-gradient(110deg, transparent 0 38%, rgba(255,255,255,.26) 42%, transparent 48% 100%)',
    inset: 0,
    opacity: 0.8,
    position: 'absolute',
  },
  chamberShakeLayer: {height: '100%', position: 'absolute', width: '100%'},
  lowerThird: {
    background: 'linear-gradient(90deg, rgba(7,15,34,.9), rgba(18,51,112,.82), rgba(7,15,34,.55))',
    borderLeft: '8px solid #f59e0b',
    bottom: 54,
    display: 'grid',
    gap: 2,
    left: 56,
    minWidth: 760,
    padding: '18px 28px',
    position: 'absolute',
  },
  slot: {
    alignItems: 'center',
    border: '5px solid rgba(255,221,166,.9)',
    borderRadius: '50%',
    boxShadow: 'inset 0 0 18px rgba(255,255,255,.35), 0 0 14px rgba(251,191,36,.26)',
    display: 'flex',
    height: 106,
    justifyContent: 'center',
    position: 'absolute',
    top: 52,
    width: 106,
  },
  slotLayer: {height: '100%', left: 0, position: 'absolute', top: 0, width: '100%'},
  stage: {backgroundColor: '#050b18', color: '#fff', fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif', overflow: 'hidden'},
  titleBar: {
    alignItems: 'center',
    background: 'linear-gradient(90deg, rgba(9,20,44,.88), rgba(13,39,94,.64), rgba(9,20,44,.1))',
    borderLeft: '8px solid #f59e0b',
    display: 'flex',
    gap: 24,
    left: 56,
    padding: '16px 26px',
    position: 'absolute',
    top: 34,
  },
  vignette: {
    background: 'radial-gradient(circle at 50% 45%, transparent 0 44%, rgba(1,8,20,.18) 68%, rgba(1,8,20,.62) 100%)',
    inset: 0,
    position: 'absolute',
  },
};
