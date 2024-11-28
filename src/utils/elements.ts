import { VIRTUAL_SECTION_ID } from "@/constants/constants";

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
  direction: "ArrowLeft" | "ArrowRight",
  activeLeft: number,
  activeRight: number
): HTMLElement | null => {
  let closestElement: HTMLElement | null = null;
  let minDistance = Infinity;

  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    const left = rect.left;
    const right = rect.right;

    const distance =
      direction === "ArrowLeft" ? activeLeft - right : left - activeRight;

    if (distance > 0 && distance < minDistance) {
      minDistance = distance;
      closestElement = element;
    }
  }

  return closestElement;
};
// export const findClosestElement = (
//   elements: HTMLElement[],
//   centerX: number,
//   direction: "ArrowLeft" | "ArrowRight",
//   top: number,
//   bottom: number
// ): HTMLElement | null => {
//   let closestElement: HTMLElement | null = null;
//   let minDistance = Infinity;

//   for (const element of elements) {
//     const rect = element.getBoundingClientRect();
//     const elementCenterX = (rect.left + rect.right) / 2;

//     if (!isElementOverlapping(top, bottom, element)) {
//       continue;
//     }

//     // ArrowLeft: 중심보다 왼쪽, ArrowRight: 중심보다 오른쪽에 있는 요소만 고려
//     const isValidDirection =
//       direction === "ArrowLeft"
//         ? elementCenterX < centerX
//         : elementCenterX > centerX;

//     if (isValidDirection) {
//       const distance = Math.abs(elementCenterX - centerX);
//       if (distance < minDistance) {
//         minDistance = distance;
//         closestElement = element;
//       }
//     }
//   }

//   return closestElement;
// };

// export const getSiblingElement = (
//   currentElement: HTMLElement,
//   direction: "ArrowLeft" | "ArrowRight"
// ): HTMLElement | null => {
//   let siblingElement =
//     direction === "ArrowLeft"
//       ? currentElement.previousElementSibling
//       : currentElement.nextElementSibling;

//   if (!siblingElement) {
//     siblingElement =
//       direction === "ArrowLeft"
//         ? currentElement.parentElement?.previousElementSibling
//         : currentElement.parentElement?.nextElementSibling;
//   }
//   return siblingElement;

//   //   let sibling =
//   //     direction === "ArrowLeft"
//   //       ? currentElement.previousElementSibling
//   //       : currentElement.nextElementSibling;
// };
