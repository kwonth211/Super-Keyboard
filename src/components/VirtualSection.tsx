import { getVisibleElements, isElementClickable } from "@/utils/elements";
import { throttle } from "lodash-es";
import { useCallback, useEffect, useRef, useState } from "react";
import "./root.css";

export const VirtualSection = () => {
  const activeElement = useRef<HTMLElement | null>(null);
  const allElements = useRef<HTMLElement[]>([]);

  const [trackerStyle, setTrackerStyle] = useState({
    left: 0,
    top: 0,
    width: 10,
    height: 10,
    transition: "0.1s ease-in-out",
  });

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const originRect = activeElement.current?.getBoundingClientRect();

    if (!originRect || !allElements.current) {
      return;
    }

    if (event.key === "Enter") {
      if (activeElement.current) {
        activeElement.current.click();
      }
    }

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
            return rect.bottom <= originRect.top;
          case "ArrowDown":
            return rect.top >= originRect.bottom;
          case "ArrowLeft":
            return rect.right <= originRect.left;
          case "ArrowRight":
            return rect.left >= originRect.right;
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
        // if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        //   return 0;
        // }

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

    if (sortedElements.length > 0) {
      const closestElement = sortedElements[0].element;

      // console.log(closestElement);
      // closestElement.focus();
      setActiveElement(closestElement);
    }
  }, []);

  const setActiveElement = (element: HTMLElement) => {
    if (activeElement.current) {
      activeElement.current.removeAttribute("data-is-virtual");
    }

    activeElement.current = element;
    // element.style.background = "red";
    element.dataset.isVirtual = "true";

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;

    setTrackerStyle((prev) => ({
      ...prev,
      left: centerX - 5,
      top: centerY - 5,
    }));
  };

  const handleScroll = useCallback(() => {
    const elements = getVisibleElements();
    allElements.current = elements;
  }, []);

  useEffect(() => {
    const elements = getVisibleElements();

    // const index = Math.floor(elements.length / 3);

    setActiveElement(elements[0]);

    allElements.current = elements;
  }, []);

  useEffect(() => {
    if (activeElement.current?.tagName === "IFRAME") {
      const iframe = activeElement.current as HTMLIFrameElement;
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDocument) {
        const potentialElements = Array.from(
          iframeDocument.body.querySelectorAll("*")
        ) as HTMLElement[];

        const clickableElements = potentialElements.filter((x) =>
          isElementClickable(x)
        );

        if (clickableElements.length > 0) {
          // iframe 내부의 첫 번째 클릭 가능한 요소를 활성화
          setActiveElement(clickableElements[0]);
        }
      }
    }
  }, [trackerStyle]);

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
      id="tracker"
      style={{
        position: "absolute",
        backgroundColor: "rgba(0, 123, 255, 0.3)",
        border: "2px solid rgba(0, 123, 255, 0.8)",
        zIndex: "999999",
        borderRadius: "50%",
        pointerEvents: "none",
        ...trackerStyle,
      }}
    />
  );
};
