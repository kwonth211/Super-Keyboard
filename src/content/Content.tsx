import { ContentApp } from "@/components/ContentApp";

import ReactDOM from "react-dom/client";

// 컨테이너를 생성하여 바디에 추가
const container = document.createElement("div");
document.body.appendChild(container);
// React 컴포넌트를 렌더링
ReactDOM.createRoot(container).render(<ContentApp />);
