import { visit } from 'unist-util-visit';
import probe from 'probe-image-size';
import sharp from 'sharp';

// 원격 이미지(S3)는 next/image가 blurDataURL을 자동 생성하지 못한다.
// 빌드 타임에 원본을 16px webp 썸네일로 줄여 base64로 인코딩하고, placeholder로 주입한다.
async function makeBlurDataURL(src) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  const buf = await sharp(input)
    .resize(16, 16, { fit: 'inside' }) // 가장 긴 변 16px, 비율 유지
    .webp({ quality: 50 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

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

        // blurDataURL은 실패해도 본문 렌더에 영향이 없도록 독립적으로 처리한다.
        try {
          node.properties.blurDataURL = await makeBlurDataURL(node.properties.src);
        } catch (err) {
          // 생성 실패 시 미주입 → AnimatedImage가 placeholder 없이 정상 렌더
          console.warn(`[rehype-image-size] blur failed: ${node.properties.src}`);
        }
      })
    );
  };
}
