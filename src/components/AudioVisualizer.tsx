 import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  coverArtUrl: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, isPlaying, coverArtUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const topCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const previousHeightsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    const topCanvas = topCanvasRef.current;
    if (!canvas || !leftCanvas || !rightCanvas || !topCanvas) return;

    const ctx = canvas.getContext('2d');
    const leftCtx = leftCanvas.getContext('2d');
    const rightCtx = rightCanvas.getContext('2d');
    const topCtx = topCanvas.getContext('2d');
    if (!ctx || !leftCtx || !rightCtx || !topCtx) return;

    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;

    // Initialize previous heights for smoothing
    if (previousHeightsRef.current.length === 0) {
      previousHeightsRef.current = new Array(64 + 32 + 32 + 64).fill(0); // bottom 64, left 32, right 32, top 64
    }

    const draw = () => {
      if (!isPlaying || !analyser) return;

      const freqArray = new Uint8Array(bufferLength);

      // @ts-ignore
      analyser.getByteFrequencyData(freqArray);

      // Bottom canvas (tallest on right, bars extending downward)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 64;
      const barWidth = canvas.width / barCount;
      for (let i = 0; i < barCount; i++) {
        const reversedI = barCount - 1 - i;
        const freqIndex = Math.floor((reversedI / barCount) * bufferLength);
        const targetHeight = (freqArray[freqIndex] / 255) * canvas.height;
        const prevIndex = i;
        const previousHeight = previousHeightsRef.current[prevIndex] || 0;
        const barHeight = previousHeight + (targetHeight - previousHeight) * 0.2;
        previousHeightsRef.current[prevIndex] = barHeight;
        const x = i * barWidth;
        const y = 0;
        const hue = (targetHeight / canvas.height) * 140 + 200;
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, `hsl(${hue}, 80%, 40%)`);
        gradient.addColorStop(1, `hsl(${hue}, 100%, 70%)`);
        ctx.fillStyle = gradient;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.shadowBlur = 20;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }

      // Left canvas (tallest at bottom, bars extending leftward)
      leftCtx.clearRect(0, 0, leftCanvas.width, leftCanvas.height);
      const leftBarCount = 32;
      const leftBarHeight = leftCanvas.height / leftBarCount;
      for (let i = 0; i < leftBarCount; i++) {
        const reversedI = leftBarCount - 1 - i;
        const freqIndex = Math.floor((reversedI / leftBarCount) * bufferLength);
        const targetWidth = (freqArray[freqIndex] / 255) * leftCanvas.width;
        const prevIndex = 64 + i;
        const previousWidth = previousHeightsRef.current[prevIndex] || 0;
        const barWidth = previousWidth + (targetWidth - previousWidth) * 0.2;
        previousHeightsRef.current[prevIndex] = barWidth;
        const x = leftCanvas.width - barWidth;
        const y = i * leftBarHeight;
        const hue = (targetWidth / leftCanvas.width) * 140 + 200;
        const gradient = leftCtx.createLinearGradient(x + barWidth, y, x, y);
        gradient.addColorStop(0, `hsl(${hue}, 80%, 40%)`);
        gradient.addColorStop(1, `hsl(${hue}, 100%, 70%)`);
        leftCtx.fillStyle = gradient;
        leftCtx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        leftCtx.shadowBlur = 20;
        leftCtx.fillRect(x, y, barWidth, leftBarHeight - 1);
      }

      // Right canvas (tallest at top, bars extending rightward)
      rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
      const rightBarCount = 32;
      const rightBarHeight = rightCanvas.height / rightBarCount;
      for (let i = 0; i < rightBarCount; i++) {
        const freqIndex = Math.floor((i / rightBarCount) * bufferLength);
        const targetWidth = (freqArray[freqIndex] / 255) * rightCanvas.width;
        const prevIndex = 96 + i;
        const previousWidth = previousHeightsRef.current[prevIndex] || 0;
        const barWidth = previousWidth + (targetWidth - previousWidth) * 0.2;
        previousHeightsRef.current[prevIndex] = barWidth;
        const x = 0;
        const y = i * rightBarHeight;
        const hue = (targetWidth / rightCanvas.width) * 140 + 200;
        const gradient = rightCtx.createLinearGradient(x, y, x + barWidth, y);
        gradient.addColorStop(0, `hsl(${hue}, 80%, 40%)`);
        gradient.addColorStop(1, `hsl(${hue}, 100%, 70%)`);
        rightCtx.fillStyle = gradient;
        rightCtx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        rightCtx.shadowBlur = 20;
        rightCtx.fillRect(x, y, barWidth, rightBarHeight - 1);
      }

      // Top canvas (tallest on left, bars extending upward)
      topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
      const topBarCount = 64;
      const topBarWidth = topCanvas.width / topBarCount;
      for (let i = 0; i < topBarCount; i++) {
        const freqIndex = Math.floor((i / topBarCount) * bufferLength);
        const targetHeight = (freqArray[freqIndex] / 255) * topCanvas.height;
        const prevIndex = 128 + i;
        const previousHeight = previousHeightsRef.current[prevIndex] || 0;
        const barHeight = previousHeight + (targetHeight - previousHeight) * 0.2;
        previousHeightsRef.current[prevIndex] = barHeight;
        const x = i * topBarWidth;
        const y = topCanvas.height - barHeight;
        const hue = (targetHeight / topCanvas.height) * 140 + 200;
        const gradient = topCtx.createLinearGradient(x, y + barHeight, x, y);
        gradient.addColorStop(0, `hsl(${hue}, 80%, 40%)`);
        gradient.addColorStop(1, `hsl(${hue}, 100%, 70%)`);
        topCtx.fillStyle = gradient;
        topCtx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        topCtx.shadowBlur = 20;
        topCtx.fillRect(x, y, topBarWidth - 1, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return (
    <div className="relative inline-block">
      <img
        src={coverArtUrl}
        alt="Cover Art"
        className="w-64 h-64 rounded-lg shadow-2xl"
      />
      <canvas
        ref={leftCanvasRef}
        width={64}
        height={256}
        className="absolute"
        style={{ left: '-64px', top: '0px' }}
      />
      <canvas
        ref={rightCanvasRef}
        width={64}
        height={256}
        className="absolute"
        style={{ right: '-64px', top: '0px' }}
      />
      <canvas
        ref={topCanvasRef}
        width={256}
        height={64}
        className="absolute"
        style={{ top: '-64px', left: '0px' }}
      />
      <canvas
        ref={canvasRef}
        width={256}
        height={64}
        className="absolute"
        style={{ bottom: '-64px', left: '0px' }}
      />
    </div>
  );
};

export default AudioVisualizer;
