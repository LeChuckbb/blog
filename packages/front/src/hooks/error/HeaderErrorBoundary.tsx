import { isAxiosError } from "axios";
import React from "react";
import Header from "../../layout/Header";

interface Props {
  children?: React.ReactElement;
}
interface State {
  shouldHandleError: boolean;
  shouldRethrowError: boolean;
  error: any;
}

export class HeaderErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldHandleError: false,
      shouldRethrowError: false,
      error: null,
    };
  }

  // 하위의 자손 컴포넌트에서 오류가 발생했을 때 호출된다.
  static getDerivedStateFromError(error: any) {
    if (isAxiosError(error)) {
      return { shouldHandleError: false, shouldRethrowError: true, error };
    }

    return { shouldHandleError: true, shouldRethrowError: false };
  }

  render() {
    const { shouldHandleError, shouldRethrowError } = this.state;
    const { children } = this.props;

    if (shouldRethrowError) {
      // Global APIErrorBoundary에 위임
      // throw this.state.error;
      // return <Header />; // not working
      return <div>hi</div>;
    }

    if (shouldHandleError) {
      return <div>Header Error Boundary</div>;
    }

    return children;
  }
}
