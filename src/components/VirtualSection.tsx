import { getVisibleElements } from "@/utils/elements";
import { throttle } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";
import "./root.css";

export const VirtualSection = () => {
  const activeElement = useRef<HTMLElement | null>(null);
  const allElements = useRef<HTMLElement[]>([]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const originRect = activeElement.current?.getBoundingClientRect();
    if (!originRect || !allElements.current) return;

    // 현재 활성 엘리먼트의 중심점
    const originCenter = {
      x: originRect.left + originRect.width / 2,
      y: originRect.top + originRect.height / 2,
    };

    let closestElement: HTMLElement | null = null;
    let closestDistance = Infinity;

    allElements.current.forEach((element) => {
      if (element === activeElement.current) return; // 현재 엘리먼트는 제외

      const rect = element.getBoundingClientRect();
      const elementCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      // 방향에 따른 거리 계산
      let distance = Infinity;
      switch (event.key) {
        case "ArrowUp":
          if (elementCenter.y < originCenter.y) {
            // 위쪽에 있는 엘리먼트만
            distance =
              Math.abs(originCenter.y - elementCenter.y) +
              Math.abs(originCenter.x - elementCenter.x);
          }
          break;

        case "ArrowDown":
          if (elementCenter.y > originCenter.y) {
            // 아래쪽에 있는 엘리먼트만
            distance =
              Math.abs(originCenter.y - elementCenter.y) +
              Math.abs(originCenter.x - elementCenter.x);
          }
          break;

        case "ArrowLeft":
          if (elementCenter.x < originCenter.x) {
            // 왼쪽에 있는 엘리먼트만
            distance =
              Math.abs(originCenter.x - elementCenter.x) +
              Math.abs(originCenter.y - elementCenter.y);
          }
          break;

        case "ArrowRight":
          if (elementCenter.x > originCenter.x) {
            // 오른쪽에 있는 엘리먼트만
            distance =
              Math.abs(originCenter.x - elementCenter.x) +
              Math.abs(originCenter.y - elementCenter.y);
          }
          break;

        default:
          return;
      }

      // 가장 가까운 엘리먼트 갱신
      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = element;
      }
    });

    // 가장 가까운 엘리먼트 활성화
    if (closestElement) {
      console.log(closestElement);
      setActiveElement(closestElement);
    }
  }, []);

  const setActiveElement = (element: HTMLElement) => {
    if (activeElement.current) {
      activeElement.current.removeAttribute("data-is-virtual");
    }

    activeElement.current = element;
    element.dataset.isVirtual = "true";
  };

  const handleScroll = useCallback(() => {
    const elements = getVisibleElements();
    allElements.current = elements;

    // console.log(elements);
    // const scrollDelta = window.scrollY - lastScrollY;
    // lastScrollY = window.scrollY;

    // setPositionY((prev) => {
    //   const newPosition = prev + scrollDelta;

    //   return newPosition;
    // });
  }, []);

  useEffect(() => {
    const elements = getVisibleElements();

    setActiveElement(elements[1]);

    allElements.current = elements;
  }, []);

  useEffect(() => {
    if (!activeElement.current) {
      return;
    }

    console.log(activeElement);
  }, [activeElement.current]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", throttle(handleScroll));
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleKeyDown, handleScroll]);

  return (
    <div
      id="virtual-section"
      // ref={ref}
      style={{
        position: "absolute",
        // top: `${positionY}px`,
      }}
    ></div>
  );
};
