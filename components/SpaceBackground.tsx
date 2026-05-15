'use client';

import React, { useEffect, useState } from 'react';

export default function SpaceBackground() {
  const [stars, setStars] = useState<{ x: string; y: string; size: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    const starCount = 150;
    const newStars = Array.from({ length: starCount }).map(() => ({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="stars-container">
      <div className="milky-way" />
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            '--duration': star.duration,
            animationDelay: star.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
