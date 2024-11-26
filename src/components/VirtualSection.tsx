import { useState, useEffect } from "react";
import "./root.css";
import { throttle } from "lodash-es";
const SPEED = 70;
const VIRTUAL_SECTION_ID = "virtual-section";

export const VirtualSection = () => {
  const [position, setPosition] = useState(0);
  let lastScrollY = window.scrollY;

  const handleKeyDown = (event: KeyboardEvent) => {
    const sectionElement = document.getElementById(VIRTUAL_SECTION_ID);
    if (!sectionElement) {
      return;
    }

    const sectionHeight = sectionElement.offsetHeight;
    const viewportHeight = window.innerHeight;

    // scroll된 좌표 + 화면 길이 - 섹션 길이
    const maxPosition = window.scrollY + viewportHeight - sectionHeight;

    if (event.key === "ArrowUp") {
      setPosition((prev) => {
        const newPos = Math.max(prev - SPEED, window.scrollY);
        return newPos;
      });
    } else if (event.key === "ArrowDown") {
      setPosition((prev) => {
        const newPos = Math.min(prev + SPEED, maxPosition);
        return newPos;
      });
    }
  };

  const handleScroll = () => {
    const scrollDelta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;

    setPosition((prev) => {
      const newPosition = prev + scrollDelta;

      return newPosition;
    });
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", throttle(handleScroll));
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      id="virtual-section"
      style={{
        position: "absolute",
        top: `${position}px`,
      }}
    ></div>
  );
};
