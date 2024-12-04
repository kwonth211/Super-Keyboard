import { getVisibleElements } from "@/utils/elements";
import { throttle } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";
import "./root.css";

export const VirtualSection = () => {
  const activeElement = useRef<HTMLElement | null>(null);
  const allElements = useRef<HTMLElement[]>([]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (activeElement.current) {
        activeElement.current.click();
      }
    }

    const originRect = activeElement.current?.getBoundingClientRect();
    if (!originRect || !allElements.current) return;

    // 방향에 따라 특정 기준으로 필터링 및 정렬
    const sortedElements = allElements.current
      .filter((element: HTMLElement) => element !== activeElement.current) // 현재 엘리먼트 제외
      .map((element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return { element, rect };
      })
      .filter(({ rect }) => {
        // 방향 필터링: 해당 방향에 있는 엘리먼트만 포함
        switch (event.key) {
          case "ArrowUp":
            return rect.bottom <= originRect.top; // 위쪽
          case "ArrowDown":
            return rect.top >= originRect.bottom; // 아래쪽
          case "ArrowLeft":
            return rect.right <= originRect.left; // 왼쪽
          case "ArrowRight":
            return rect.left >= originRect.right; // 오른쪽
          default:
            return false;
        }
      })
      .sort((a, b) => {
        // 방향에 따른 정렬
        switch (event.key) {
          case "ArrowUp":
            // 위쪽: Y축(top 또는 bottom)의 차이가 가장 작은 순서
            return (
              Math.abs(a.rect.right - originRect.right) -
                Math.abs(b.rect.right - originRect.right) ||
              Math.abs(a.rect.top - originRect.top) -
                Math.abs(b.rect.top - originRect.top)
            );
          case "ArrowDown":
            // 아래쪽: Y축(top 또는 bottom)의 차이가 가장 작은 순서
            return (
              Math.abs(a.rect.left - originRect.left) -
                Math.abs(b.rect.left - originRect.left) ||
              Math.abs(a.rect.bottom - originRect.bottom) -
                Math.abs(b.rect.bottom - originRect.bottom)
            );
          case "ArrowLeft":
            // 왼쪽: X축(left 또는 right)의 차이가 가장 작은 순서
            return (
              Math.abs(a.rect.top - originRect.top) -
                Math.abs(b.rect.top - originRect.top) ||
              Math.abs(a.rect.right - originRect.right) -
                Math.abs(b.rect.right - originRect.right)
            );
          case "ArrowRight":
            // 오른쪽: X축(left 또는 right)의 차이가 가장 작은 순서
            return (
              Math.abs(a.rect.top - originRect.top) -
                Math.abs(b.rect.top - originRect.top) ||
              Math.abs(a.rect.left - originRect.left) -
                Math.abs(b.rect.left - originRect.left)
            );
          default:
            return 0;
        }
      });

    console.log(sortedElements);
    // 가장 가까운 엘리먼트를 활성화
    if (sortedElements.length > 0) {
      const closestElement = sortedElements[0].element;

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
