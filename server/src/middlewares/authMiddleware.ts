import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { config as configDotenv } from "dotenv";

configDotenv();

const jwksClient = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
}) as GetVerificationKey;

export const checkJwt = expressjwt({
  secret: jwksClient,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});
