export interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  readingTime?: number;
  /** content/ 아래 실제 MDX 파일명 (sync가 기록). 없으면 `${title}.mdx`로 폴백 */
  filename?: string;
  series?: string;
}

export type LinkPreviewData =
  | {
      kind: "post";
      title: string;
      date: string;
      readingTime?: number;
      series?: string;
      description?: string;
    }
  | {
      kind: "external";
      title: string;
      domain: string;
      description?: string;
      image?: string;
    };
