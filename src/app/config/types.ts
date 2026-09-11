export interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  readingTime?: number;
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
