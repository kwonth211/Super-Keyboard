import { VIRTUAL_SECTION_ID } from "@/constants/constants";

export const getNearbyElements = (top: number, bottom: number): Element[] => {
  const sectionElement = document.getElementById(VIRTUAL_SECTION_ID);
  if (!sectionElement) {
    console.warn(`Element with ID "${VIRTUAL_SECTION_ID}" not found.`);
    return [];
  }

  const potentialElements = Array.from(document.body.querySelectorAll("*"));

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
    // console.log("tabIndex", element);
    return true;
  }

  if ((element as HTMLElement).onclick) {
    // console.log("onClick", element);
    return true;
  }

  return false;
};
