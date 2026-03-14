import { visit } from 'unist-util-visit';
import probe from 'probe-image-size';

export default function rehypeImageSize() {
  return async function transformer(tree) {
    const images = [];

    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'img' &&
        typeof node.properties?.src === 'string' &&
        node.properties.src.startsWith('http')
      ) {
        images.push(node);
      }
    });

    await Promise.all(
      images.map(async (node) => {
        try {
          const result = await probe(node.properties.src);
          node.properties.width = result.width;
          node.properties.height = result.height;
        } catch (err) {
          // 프로빙 실패 시 폴백: 큰 16:9 기본값 (최적화는 유지)
          console.warn(`[rehype-image-size] probe failed: ${node.properties.src}`);
          node.properties.width = 1920;
          node.properties.height = 1080;
        }
      })
    );
  };
}
