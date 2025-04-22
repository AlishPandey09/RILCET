import { Router } from "express";
import { evaluate } from "../controllers/evaluate.controller.js";

const router = Router();

router.route("/").post(evaluate);

export default router;
