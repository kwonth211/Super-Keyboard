import { useState, useEffect } from "react";
import "./root.css";

const SPEED = 70;
const VIRTUAL_SECTION_ID = "virtual-section";

export const VirtualSection = () => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
