'use client';

import { useEffect, useState } from 'react';

export default function Typewriter({ parts, speed = 100, deleteSpeed = 45, pauseAfterType = 1400, pauseAfterDelete = 250 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalChars = parts.reduce((sum, part) => sum + part.text.length, 0);

  useEffect(() => {
    let timeout;

    if (!isDeleting && currentIndex < totalChars) {
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, speed);
    } else if (!isDeleting && currentIndex >= totalChars) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseAfterType);
    } else if (isDeleting && currentIndex > 0) {
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, deleteSpeed);
    } else if (isDeleting && currentIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, pauseAfterDelete);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, deleteSpeed, isDeleting, pauseAfterDelete, pauseAfterType, speed, totalChars]);

  const displayParts = parts.reduce((acc, part) => {
    const start = acc.charCount;
    const end = start + part.text.length;
    const visibleText = part.text.slice(0, Math.max(0, currentIndex - start));
    acc.parts.push({ ...part, text: visibleText });
    acc.charCount = end;
    return acc;
  }, { parts: [], charCount: 0 }).parts;

  return (
    <>
      {displayParts.map((part, index) => (
        <span key={index} className={part.className}>
          {part.text}
        </span>
      ))}
      <span className="typing-cursor">|</span>
    </>
  );
}