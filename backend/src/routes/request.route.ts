import { Router } from "express";
import { sendRequest, removeRequest } from "../controllers/request.controller";

const router = Router();

router.post("/send", sendRequest);
router.delete("/remove/:userId/:requestId", removeRequest);

export default router;
