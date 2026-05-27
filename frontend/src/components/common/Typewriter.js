'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * @param {{
 *   parts?: { text: string; className?: string }[];
 *   sequences?: { text: string; className?: string }[][];
 *   speed?: number;
 *   deleteSpeed?: number;
 *   pauseAfterType?: number;
 *   pauseAfterDelete?: number;
 *   loop?: boolean;
 *   cursorClassName?: string;
 * }} props
 */
export default function Typewriter({
  parts: partsProp,
  sequences,
  speed = 100,
  deleteSpeed = 45,
  pauseAfterType = 1400,
  pauseAfterDelete = 250,
  loop = true,
  cursorClassName = 'typing-cursor',
}) {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [finished, setFinished] = useState(false);

  const activeParts = useMemo(() => {
    if (sequences?.length) return sequences[sequenceIndex] ?? sequences[0];
    return partsProp ?? [];
  }, [partsProp, sequenceIndex, sequences]);

  const totalChars = activeParts.reduce((sum, part) => sum + part.text.length, 0);
  const hasMultipleSequences = Boolean(sequences?.length && sequences.length > 1);
  const shouldLoop = loop || hasMultipleSequences;

  useEffect(() => {
    setCharIndex(0);
    setIsDeleting(false);
    setFinished(false);
  }, [sequenceIndex]);

  useEffect(() => {
    let timeout;

    if (!shouldLoop && finished) return undefined;

    if (!isDeleting && charIndex < totalChars) {
      timeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, speed);
    } else if (!isDeleting && charIndex >= totalChars) {
      if (!shouldLoop) {
        setFinished(true);
        return undefined;
      }
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseAfterType);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, deleteSpeed);
    } else if (isDeleting && charIndex === 0) {
      timeout = setTimeout(() => {
        if (hasMultipleSequences) {
          setSequenceIndex((prev) => (prev + 1) % sequences.length);
        }
        setIsDeleting(false);
      }, pauseAfterDelete);
    }

    return () => clearTimeout(timeout);
  }, [
    charIndex,
    deleteSpeed,
    finished,
    hasMultipleSequences,
    isDeleting,
    pauseAfterDelete,
    pauseAfterType,
    sequences,
    shouldLoop,
    speed,
    totalChars,
  ]);

  const displayParts = activeParts.reduce(
    (acc, part) => {
      const start = acc.charCount;
      const visibleText = part.text.slice(0, Math.max(0, charIndex - start));
      acc.parts.push({ ...part, text: visibleText });
      acc.charCount = start + part.text.length;
      return acc;
    },
    { parts: [], charCount: 0 }
  ).parts;

  return (
    <>
      {displayParts.map((part, index) => (
        <span key={`${sequenceIndex}-${index}`} className={part.className}>
          {part.text}
        </span>
      ))}
      {(!finished || shouldLoop) ? (
        <span className={cursorClassName} aria-hidden>
          |
        </span>
      ) : null}
    </>
  );
}
