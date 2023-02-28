import { atom } from "recoil";
import { v1 } from "uuid";

export const themeState = atom({
  key: `themeState/${v1()}`,
  default: false,
});

export const modalState = atom({
  key: `modalState/${v1()}`,
  default: {
    isOpen: false,
    content: <></>,
  },
});
