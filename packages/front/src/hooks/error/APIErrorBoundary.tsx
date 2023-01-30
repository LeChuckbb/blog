import { isAxiosError } from "axios";
import React from "react";

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
}

export class APIErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    if (isAxiosError(error)) {
      // Global APIErrorBoundary에4 위임
      if (error?.response?.data?.code === "AUE004") {
        console.log("AUE004");
        return;
      }
    }

    return { hasError: true };
  }

  render() {
    console.log(this.state);
    console.log(React.Children.toArray(this.props.children)[0]);
    console.log(<div>hi</div>);
    const childrenArray = React.Children.toArray(this.props.children);
    if (this.state.hasError) {
      console.log("has Error");
      return <div>App.ts APIErrorBoundary</div>;
    }
    // return (
    //   <div>
    //     <p>yayyaya</p>
    //   </div>
    // );
    console.log("RENDER !!!");
    console.log(childrenArray);
    console.log(childrenArray[0]);
    // return childrenArray[0];
    return <>{this.props.children}</>;
    // return <div>hi</div>;
  }
}
