"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [faded, setFaded] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
      setFaded(false);

      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => setFaded(true), 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: faded ? 0.3 : 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          aria-label="맨 위로 이동"
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/80 backdrop-blur-sm text-primary active:scale-95"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
