import { AUTH_COOKIE_NAME, authCookieOptions } from "../config/auth.js";
import { authService } from "../services/authService.js";

export const login = async (req, res) => {
  const { token, user, maxAge } = await authService.login(req.validated);
  res
    .cookie(AUTH_COOKIE_NAME, token, { ...authCookieOptions, maxAge })
    .status(200)
    .json({ success: true, message: "Login successful", data: user });
};

export const logout = (_req, res) => {
  res
    .clearCookie(AUTH_COOKIE_NAME, authCookieOptions)
    .status(200)
    .json({ success: true, message: "Logout successful", data: null });
};

export const me = (req, res) => {
  res.status(200).json({ success: true, data: authService.getSafeUser(req.user) });
};
