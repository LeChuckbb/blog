import { useEffect, useRef, useState } from "react";

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<string>();
  const prevY = useRef(0);
  const timeoutRef = useRef<any>(null);

  const handleScroll = () => {
    console.log("handle Scroll");
    const currentScrollY = window.scrollY;
    if (prevY.current > currentScrollY) {
      setScrollDirection("up");
    } else if (prevY.current < currentScrollY) {
      setScrollDirection("down");
    }
    prevY.current = currentScrollY;
  };

  const throttleScroll = () => {
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        handleScroll();
        timeoutRef.current = null;
      }, 300);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", throttleScroll);
  }, []);

  return { scrollDirection };
};

export default useScrollDirection;
