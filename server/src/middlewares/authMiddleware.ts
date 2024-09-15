import { auth } from "express-oauth2-jwt-bearer";
import { NextFunction } from "express";
import { fetchSessionById } from "../services/trainingSessionService";

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
export const checkJwt = auth({
  audience: "https://ascend-metrics-api.com",
  issuerBaseURL: "https://dev-rlyrvpnrecxx2kzm.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

export function getAuth0IdFromReq(req: any) {
  return req.auth.payload.sub;
}

export async function verifyOwnership(
  req: any,
  res: any,
  next: NextFunction
): Promise<void> {
  const { sessionId } = req.params;
  const auth0id = getAuth0IdFromReq(req);

  if (!auth0id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const session = await fetchSessionById(sessionId, auth0id);

    if (!session) {
      return res.status(404).json({ error: "Training session not found" });
    }

    if (session.user.auth0id !== auth0id) {
      return res.status(403).json({
        error: "Forbidden: You do not have permission to modify this session",
      });
    }

    next();
  } catch (error) {
    console.error("Error verifying ownership:", error);
    return res.status(500).json({ error: "Failed to verify ownership" });
  }
}
