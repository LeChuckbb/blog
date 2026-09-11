import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * 글 제목의 view-transition-name. 목록의 제목과 글 페이지 h1에 같은 이름을 주면
 * 전환 때 제목이 제자리에서 이어진다. slug에 한글·기호가 섞여 있어 CSS 식별자로 쓰기 어렵고,
 * 이름은 문서 안에서만 유일하면 되므로 짧은 해시로 만든다.
 */
export const postTitleTransitionName = (slug: string) => {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return `post-title-${(hash >>> 0).toString(36)}`;
};
