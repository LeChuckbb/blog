import { isAxiosError } from "axios";
import React from "react";

// reset -> shouldHandleError를 false로 초기화시켜주는

interface Props {
  children?: React.ReactElement;
  fallback?: any;
  reset?: (...args: unknown[]) => void;
  resetKeys?: unknown[];
}

interface State {
  shouldHandleError: boolean;
  shouldRethrowError: boolean;
  WhichInterface: any;
  error: any;
}

export class HeaderErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldHandleError: false,
      shouldRethrowError: false,
      WhichInterface: null,
      error: null,
    };
  }

  // 하위의 자손 컴포넌트에서 오류가 발생했을 때 호출된다.
  static getDerivedStateFromError(error: any) {
    let WhichInterface;

    if (isAxiosError(error)) {
      if (error.response?.data?.code === "AUE005") {
        WhichInterface = <div>로그아웃에 문제가 발생했습니다.</div>;
      } else {
        return { shouldHandleError: false, shouldRethrowError: true, error };
      }
    }

    return {
      shouldHandleError: true,
      shouldRethrowError: false,
      error,
      WhichInterface,
    };
  }

  resetErrorBoundary = () => {
    console.log("reset handler");
  };

  render() {
    const { shouldHandleError, shouldRethrowError, error, WhichInterface } =
      this.state;
    const { children, fallback } = this.props;

    if (shouldRethrowError) {
      // Global APIErrorBoundary에 위임
      console.log("Should Rethrow Error");
      throw error;
    } else if (shouldHandleError) {
      // retry UI 표시하기
      // 언제 fallback을 표시하고, 언제 WhictInterface를 표시하지??
      console.log("Should Handle Error");
      return WhichInterface;
    }

    return children;
  }
}
