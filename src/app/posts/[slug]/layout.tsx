import { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex gap-2">
      <div className="block">{children}</div>
      <div>layout here</div>
    </div>
  );
}

export default Layout;
