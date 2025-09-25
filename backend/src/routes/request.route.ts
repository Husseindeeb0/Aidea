import { Router } from "express";
import { sendRequest, removeRequest, getAllUserRequests } from "../controllers/request.controller";

const router = Router();

router.post("/send", sendRequest);
router.get("/getRequests", getAllUserRequests);
router.delete("/remove/:userId/:requestId", removeRequest);

export default router;
