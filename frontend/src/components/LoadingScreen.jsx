import React, { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = Date.now();
    let duration = 1700; // 2 seconds
    let animationFrame;

    const animate = () => {
      let elapsed = Date.now() - start;
      let percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);
      if (percent < 100) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 z-50">
      <div className="text-white text-2xl font-bold mb-6">
        🤖 AI cooking up sentences for you
      </div>
      <div className="w-80 h-6 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
