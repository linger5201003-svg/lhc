import type {CSSProperties} from 'react';
import {AbsoluteFill, Img, staticFile, Video} from 'remotion';

export type RealFootageCustomDrawProps = {
  backgroundImage?: string;
  numbers?: number[];
  period?: string;
  sourceVideo?: string;
  title?: string;
};

export const realFootageCustomDrawDefaults: Required<RealFootageCustomDrawProps> = {
  backgroundImage: 'studio-background.png',
  numbers: [6, 12, 18, 24, 31, 38, 47],
  period: '20260621-001',
  sourceVideo: '',
  title: '东南亚六合彩开奖直播',
};

export function RealFootageCustomDraw({
  backgroundImage = realFootageCustomDrawDefaults.backgroundImage,
  numbers = realFootageCustomDrawDefaults.numbers,
  period = realFootageCustomDrawDefaults.period,
  sourceVideo = realFootageCustomDrawDefaults.sourceVideo,
  title = realFootageCustomDrawDefaults.title,
}: RealFootageCustomDrawProps) {
  const safeNumbers = normalizeNumbers(numbers);

  return (
    <AbsoluteFill style={styles.stage}>
      {sourceVideo ? (
        <Video muted src={staticFile(sourceVideo)} style={styles.media} />
      ) : (
        <Img src={staticFile(backgroundImage)} style={styles.media} />
      )}
      <div style={styles.shade} />
      <div style={styles.topNotice}>非官方信息展示 / 请使用真实授权录像素材</div>
      <section style={styles.resultPanel}>
        <div style={styles.kicker}>SEA MARK SIX</div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.period}>第 {period} 期</p>
        <div style={styles.balls}>
          {safeNumbers.map((number, index) => (
            <div key={`${number}-${index}`} style={styles.ball}>
              {number}
            </div>
          ))}
        </div>
        <p style={styles.caption}>自定义号码仅用于视频制作展示，真实开奖结果以官方发布为准。</p>
      </section>
      <div style={styles.footer}>无动画模板：不生成摇奖球或摇奖过程，仅叠加静态号码信息。</div>
    </AbsoluteFill>
  );
}

function normalizeNumbers(numbers: number[]) {
  return numbers
    .map((number) => Math.trunc(number))
    .filter((number) => number >= 1 && number <= 49)
    .slice(0, 7);
}

const styles: Record<string, CSSProperties> = {
  ball: {
    alignItems: 'center',
    background: 'radial-gradient(circle at 34% 25%, #fff 0 8%, #fef3c7 18%, #f59e0b 56%, #78350f 100%)',
    border: '6px solid rgba(255,255,255,.82)',
    borderRadius: '50%',
    boxShadow: 'inset -12px -18px 24px rgba(0,0,0,.34), inset 10px 10px 18px rgba(255,255,255,.36), 0 14px 24px rgba(0,0,0,.38)',
    color: '#111827',
    display: 'flex',
    fontSize: 44,
    fontWeight: 1000,
    height: 104,
    justifyContent: 'center',
    width: 104,
  },
  balls: {
    display: 'flex',
    gap: 24,
    justifyContent: 'center',
    margin: '34px 0 20px',
  },
  caption: {
    color: '#dbeafe',
    fontSize: 25,
    margin: 0,
  },
  footer: {
    background: 'rgba(3,7,18,.72)',
    bottom: 34,
    color: '#cbd5e1',
    fontSize: 24,
    left: 46,
    padding: '12px 22px',
    position: 'absolute',
  },
  kicker: {
    color: '#fbbf24',
    fontSize: 30,
    fontWeight: 1000,
    letterSpacing: 6,
  },
  media: {
    height: '100%',
    objectFit: 'cover',
    width: '100%',
  },
  period: {
    color: '#e0f2fe',
    fontSize: 34,
    margin: '14px 0 0',
  },
  resultPanel: {
    background: 'linear-gradient(180deg, rgba(7,15,34,.9), rgba(15,23,42,.76))',
    border: '1px solid rgba(255,255,255,.2)',
    borderRadius: 28,
    boxShadow: '0 28px 80px rgba(0,0,0,.42)',
    left: 210,
    padding: '36px 46px',
    position: 'absolute',
    right: 210,
    textAlign: 'center',
    top: 640,
  },
  shade: {
    background: 'linear-gradient(180deg, rgba(2,6,23,.1), rgba(2,6,23,.1) 48%, rgba(2,6,23,.58))',
    inset: 0,
    position: 'absolute',
  },
  stage: {
    backgroundColor: '#030712',
    color: '#fff',
    fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
    overflow: 'hidden',
  },
  title: {
    fontSize: 68,
    lineHeight: 1,
    margin: '18px 0 0',
  },
  topNotice: {
    background: 'rgba(127,29,29,.76)',
    border: '1px solid rgba(254,202,202,.46)',
    borderRadius: 999,
    color: '#fee2e2',
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: 2,
    padding: '12px 24px',
    position: 'absolute',
    right: 44,
    top: 36,
  },
};
