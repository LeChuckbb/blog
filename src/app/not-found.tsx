import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-primary hover:underline transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
