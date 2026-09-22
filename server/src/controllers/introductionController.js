import { introductionService } from "../services/introductionService.js";

export const getIntroduction = async (_req, res) => {
  const data = await introductionService.get();
  res.status(200).json({ success: true, data });
};

export const updateIntroduction = async (req, res) => {
  const data = await introductionService.update(req.validated.body);
  res.status(200).json({
    success: true,
    message: "Introduction content updated",
    data,
  });
};
