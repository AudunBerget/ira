import {type RefObject, useEffect} from "react";


export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClick: () => void,
) {
  useEffect(() => {
    function handler(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick();
      }
    }

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClick]);
}
