import jwt from "jsonwebtoken";
import AuthModel from "../models/auth";

// export function accessToken(id: string) {
//   return jwt.sign({ id }, process.env.ACESS_TOKEN_SECRET as string, {
//     // expiresIn: "5m",
//     expiresIn: "0",
//   });
// }

// export const verify = (token: string) => {
//   // access token 검증
//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.ACESS_TOKEN_SECRET as string);
//     console.log(decoded);
//     return true;
//   } catch (err: any) {
//     return false;
//   }
// };

// export const refreshToken = () => {
//   // refresh token 발급
//   return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET as string, {
//     // expiresIn: "7d",
//     expiresIn: "0",
//   });
// };

// export const refreshVerify = async (token: string, id: string) => {
//   // refresh token 검증
//   try {
//     const data = await AuthModel.findOne({ id }, { _id: 0, refreshToken: 1 }); // refresh token 가져오기
//     if (token === data?.refreshToken) {
//       try {
//         jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
//         return true;
//       } catch (err) {
//         return false;
//       }
//     } else {
//       return false;
//     }
//   } catch (err) {
//     return false;
//   }
// };

module.exports = {
  // access token 발급
  accessToken: (id: string) => {
    return jwt.sign({ id }, process.env.ACESS_TOKEN_SECRET as string, {
      expiresIn: "5d",
      // expiresIn: "0",
    });
  },
  verify: (token: string) => {
    // access token 검증
    let decoded: any;
    console.log("token Verifying...");
    console.log(token);
    console.log(process.env.ACESS_TOKEN_SECRET);
    try {
      decoded = jwt.verify(token, process.env.ACESS_TOKEN_SECRET as string);
      console.log(decoded);
      return true;
    } catch (err: any) {
      console.log("verify Error");
      return false;
    }
  },
  refreshToken: () => {
    // refresh token 발급
    return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: "7d",
      // expiresIn: "0",
    });
  },
  refreshVerify: async (token: string, id: string) => {
    // refresh token 검증
    try {
      const data = await AuthModel.findOne({ id }, { _id: 0, refreshToken: 1 }); // refresh token 가져오기
      if (token === data?.refreshToken) {
        console.log("refreshVerify 성공");
        console.log(token);
        console.log(data?.refreshToken);
        try {
          jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        console.log("refreshVerify 실패");
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
