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
        // 1차 정렬: 주 축 기준으로 정렬
        switch (event.key) {
          case "ArrowUp":
            return (
              Math.abs(a.rect.bottom - originRect.top) -
              Math.abs(b.rect.bottom - originRect.top)
            );
          case "ArrowDown":
            return (
              Math.abs(a.rect.top - originRect.bottom) -
              Math.abs(b.rect.top - originRect.bottom)
            );
          case "ArrowLeft":
            return (
              Math.abs(a.rect.right - originRect.left) -
              Math.abs(b.rect.right - originRect.left)
            );
          case "ArrowRight":
            return (
              Math.abs(a.rect.left - originRect.right) -
              Math.abs(b.rect.left - originRect.right)
            );
          default:
            return 0;
        }
      })
      .sort((a, b) => {
        // 2차 정렬: 부 축 기준으로 정렬
        switch (event.key) {
          case "ArrowUp":
          case "ArrowDown":
            return (
              Math.abs(a.rect.left - originRect.left) -
              Math.abs(b.rect.left - originRect.left)
            );
          case "ArrowLeft":
          case "ArrowRight":
            return (
              Math.abs(a.rect.top - originRect.top) -
              Math.abs(b.rect.top - originRect.top)
            );
          default:
            return 0;
        }
      });

    // 정렬된 리스트 출력

    // 가장 가까운 엘리먼트를 활성화
    if (sortedElements.length > 0) {
      const closestElement = sortedElements[0].element;
      console.log(closestElement);
      closestElement.focus();
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
