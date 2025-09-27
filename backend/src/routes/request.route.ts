import { Router } from "express";
import {
  sendRequest,
  removeRequest,
  getAllUserRequests,
  getAllRequestHistory,
  allowRequest,
  rejectRequest,
  checkExpiration,
  getUserSubscriptions
} from "../controllers/request.controller";

const router = Router();

router.post("/send", sendRequest);
router.get("/getRequests", getAllUserRequests);
router.get("/getAllRequestHistory", getAllRequestHistory);
router.get("/checkExpiration", checkExpiration);
router.post("/allowRequest", allowRequest);
router.post("/rejectRequest", rejectRequest);
router.get("/getUserSubscriptions", getUserSubscriptions);
router.delete("/remove/:userId/:requestId", removeRequest);

export default router;
