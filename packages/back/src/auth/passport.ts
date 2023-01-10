import passport from "passport";
import passportJwt from "passport-jwt";
import Auth from "../models/auth";
const jwt = require("./jwtUtil");

const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

const accessTokenExtractor = (req: any) => {
  return req.headers.authorization;
};
passport.use(
  new StrategyJwt(
    {
      secretOrKey: process.env.ACESS_TOKEN_SECRET,
      jwtFromRequest: accessTokenExtractor,
      passReqToCallback: true,
    },
    async (req: any, jwtPayload: any, done: any) => {
      const accessToken = jwt.verify(req.headers.authorization);
      const refreshToken = await jwt.refreshVerify(
        req.cookies.refreshToken,
        jwtPayload.id
      );

      /*
        case1. Access O Refresh O
        case2. Access O Refresh X
        case3. Access X Refresh O
        case4. Access X Refresh X
      */
      if (!accessToken) {
        if (!refreshToken) {
          // case4 -> 재로그인 유도
          throw new Error("토큰이 모두 만료되었습니다. 재로그인해주세요.");
        } else {
          // case 3 -> Refresh Token을 이용해서 Access Token 재발급
          const newAccessToken = jwt.accessToken(jwtPayload.id);
          // ???
        }
      } else {
        if (!refreshToken) {
          // case 2 -> refresh Token 재발급
          const newRefreshToken = jwt.refreshToken();
        } else {
          // case 1 -> 모두가 유효한 경우, 검증 이상무 -> 그냥 넘김
        }
      }

      return Auth.findOne({ id: jwtPayload.id })
        .then((user) => {
          return done(null, user, {
            info: "yasdjaadsaskjdbuasdhbudasbuhadsbhuadsbuhds",
          });
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);
