"use client";

import { useEffect, useState } from "react";
import { useEventListener } from "./useEventListener";

/**
 * Hook useWindowSize
 *
 * This hook returns an object containing the current window size.
 * It listens for the 'resize' event and updates the window size whenever the window is resized.
 *
 * @returns {Object} An object with 'width' and 'height' properties representing the current window size.
 */
export function useWindowSize() {
  // Initialize state
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  // Set the initial window size when the component mounts - it has to be with `useEffect` because server-side rendering doesn't have window object so it will throw an error on the server side when we try set `width: window.innerWidth, height: window.innerHeight` directly in the `windowSize` state
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Use the useEventListener hook to listen for the 'resize' event
  // When the window is resized, update the state with the new window size
  useEventListener("resize", () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  });

  // Make the hook immutable by freezing the returned object
  return Object.freeze(windowSize);
}
