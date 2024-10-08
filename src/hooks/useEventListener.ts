"use client";

import { useEffect, useRef } from "react";

type EventCallback<T> = (e: T) => void;

/**
 * Hook useEventListener
 *
 * @param eventType - The type of event to listen for, e.g. 'click', 'mousemove', etc.
 * @param callback - The function to call when the event is triggered. Receives the event as an argument.
 * @param element - The element on which to listen for the event. Defaults to the `window` object.
 */
export function useEventListener<T>(
  eventType: string,
  callback: EventCallback<T>,
  element: HTMLElement | (Window & typeof globalThis) | null = typeof window !==
  "undefined"
    ? window
    : null
) {
  // Use useRef to store the current callback function
  const callbackRef = useRef<EventCallback<T>>(callback);

  // Update the ref each time the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Use useEffect to add and remove the event listener
  useEffect(() => {
    // If the element is null, do nothing
    if (element == null) return;

    // Define a handler that will call our callback function
    const handler = (e: Event) => {
      callbackRef.current(e as T);
    };

    // Add the event listener
    element.addEventListener(eventType, handler);

    // Remove the event listener when the component is unmounted or when the eventType or element changes
    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}
