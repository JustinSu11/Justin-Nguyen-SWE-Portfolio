'use client';
import { useEffect } from 'react';
import { startScene } from '@/lib/scene';

/** Boots the canvas/scroll engine once the DOM exists, and tears it down on unmount. */
export default function Scene() {
  useEffect(() => startScene(), []);
  return null;
}
