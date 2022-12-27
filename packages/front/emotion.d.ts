// You are also able to use a 3rd party theme this way:
import { theme } from "./styles/theme";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string;
    };
    mq: string[];
  }
}
