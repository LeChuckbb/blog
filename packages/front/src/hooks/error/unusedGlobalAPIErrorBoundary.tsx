import { isAxiosError } from "axios";
import React from "react";

interface Props {
  children?: any;
}
interface State {
  shouldHandleError: boolean;
  shouldRethrowError: boolean;
  error: any;
}

export class GlobalAPIErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldHandleError: false,
      shouldRethrowError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: any) {
    if (isAxiosError(error)) {
      // Global APIErrorBoundary에4 위임
      if (error?.response?.data?.code === "AUE004") {
        console.log("AUE004");
        return;
      }
    }

    return { shouldHandleError: true, shouldRethrowError: false };
  }

  render() {
    const { shouldHandleError, shouldRethrowError } = this.state;
    const { children } = this.props;

    if (shouldHandleError) {
      return <div>App.ts APIErrorBoundary</div>;
    }

    return children;
  }
}
