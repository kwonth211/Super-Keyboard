import React, { useState, useEffect } from "react";
import "./root.css";

const SPEED = 70;

export const VirtualSection = () => {
  const [position, setPosition] = useState(0); // VirtualSection의 Y축 위치

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const sectionElement = document.getElementById("virtual-section");
      if (!sectionElement) return;

      const sectionHeight = sectionElement.offsetHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const maxPosition = scrollHeight - sectionHeight;

      if (event.key === "ArrowUp") {
        // 위로 이동
        setPosition((prev) => {
          const newPos = Math.max(prev - SPEED, 0);
          scrollToKeepInView(newPos);
          return newPos;
        });
      } else if (event.key === "ArrowDown") {
        // 아래로 이동
        setPosition((prev) => {
          const newPos = Math.min(prev + SPEED, maxPosition);
          scrollToKeepInView(newPos);
          return newPos;
        });
      }
    };

    const scrollToKeepInView = (newPosition: number) => {
      const viewportHeight = window.innerHeight;
      const sectionElement = document.getElementById("virtual-section");
      if (!sectionElement) return;

      const sectionTop = newPosition - window.scrollY;
      const sectionBottom = sectionTop + sectionElement.offsetHeight;

      if (sectionTop < 0) {
        // 섹션이 화면 위로 벗어날 경우
        window.scrollBy({ top: sectionTop, behavior: "smooth" });
      } else if (sectionBottom > viewportHeight) {
        // 섹션이 화면 아래로 벗어날 경우
        window.scrollBy({
          top: sectionBottom - viewportHeight,
          behavior: "smooth",
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
    >
      Hello! Use Arrow Keys
    </div>
  );
};
