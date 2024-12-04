import { VIRTUAL_SECTION_ID } from "@/constants/constants";

export const getVisibleElements = (): HTMLElement[] => {
  const elements = Array.from(document.querySelectorAll("*")) as HTMLElement[];
  const visibleElements = elements.filter((element) => {
    const rect = element.getBoundingClientRect();

    const isInViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    const hasSize = rect.width > 0 && rect.height > 0;

    const style = getComputedStyle(element);
    const isVisible = style.visibility !== "hidden" && style.display !== "none";

    return isInViewport && hasSize && isVisible && isElementClickable(element);
  });

  return visibleElements;
};

export const getNearbyElements = (
  top: number,
  bottom: number
): HTMLElement[] => {
  const sectionElement = document.getElementById(VIRTUAL_SECTION_ID);
  if (!sectionElement) {
    console.warn(`Element with ID "${VIRTUAL_SECTION_ID}" not found.`);
    return [];
  }

  const potentialElements = Array.from(
    document.body.querySelectorAll("*")
  ) as HTMLElement[];

  return potentialElements.filter(
    (element) =>
      isElementOverlapping(top, bottom, element) && isElementClickable(element)
  );
};

export const isElementOverlapping = (
  top: number,
  bottom: number,
  element: Element
): boolean => {
  const elementRect = element.getBoundingClientRect();

  // 요소의 전체 문서 기준 좌표
  const elementTop = elementRect.top + window.scrollY;
  const elementBottom = elementRect.bottom + window.scrollY;

  // 수직 방향에서 겹치는지 확인
  return (
    elementBottom > top && // 요소의 아래쪽이 VirtualSection의 위쪽보다 아래에 있음
    elementTop < bottom // 요소의 위쪽이 VirtualSection의 아래쪽보다 위에 있음
  );
};

export const isElementClickable = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();
  if (tagName === "button" || tagName === "a") {
    return true;
  }

  const tabIndex = (element as HTMLElement).tabIndex;
  if (tabIndex >= 0) {
    return true;
  }

  if ((element as HTMLElement).onclick) {
    return true;
  }

  return false;
};

export const getActiveElement = (activeId: number): HTMLElement | null => {
  return document.querySelector(`[data-virtual-id="${activeId}"]`);
};
export const findClosestElement = (
  elements: HTMLElement[],
  direction: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown",
  activeLeft: number,
  activeRight: number,
  activeTop: number,
  activeBottom: number
): HTMLElement | null => {
  let closestElement: HTMLElement | null = null;
  let minDistance = Infinity;

  // 활성 요소의 중심 좌표 계산
  const activeCenterX = (activeLeft + activeRight) / 2;
  const activeCenterY = (activeTop + activeBottom) / 2;

  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    const left = rect.left + window.scrollX;
    const right = rect.right + window.scrollX;
    const top = rect.top + window.scrollY;
    const bottom = rect.bottom + window.scrollY;
    // 대상 요소의 중심 좌표 계산
    const elementCenterX = (left + right) / 2;
    const elementCenterY = (top + bottom) / 2;

    // 방향에 따른 유효성 조건
    const isValidDirection =
      (direction === "ArrowLeft" && right <= activeRight) || // 왼쪽
      (direction === "ArrowRight" && left >= activeLeft) || // 오른쪽
      (direction === "ArrowUp" && bottom <= activeTop) || // 위쪽
      (direction === "ArrowDown" && top >= activeBottom); // 아래쪽

    if (!isValidDirection) {
      continue;
    }

    // 유클리드 거리 계산
    const distance = Math.sqrt(
      (activeCenterX - elementCenterX) ** 2 +
        (activeCenterY - elementCenterY) ** 2
    );

    // 최소 거리 갱신
    if (distance < minDistance) {
      minDistance = distance;
      closestElement = element;
    }
  }

  return closestElement;
};
