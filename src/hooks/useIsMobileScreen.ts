import { useEffect, useState } from "react";


const useIsMobileScreen = (maxWidth: number = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    window.matchMedia(`(max-width: ${maxWidth}px)`).matches
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [maxWidth]);

  return isMobile
}

export default useIsMobileScreen;
