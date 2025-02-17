import { Router } from "express";
import contactController from "../../controllers/massagerControllers/contactController";
import { authenticateUser } from "../../middleware/authenticateUser";

const router = Router();

router.get("/query", authenticateUser(), contactController.get); // get contacts
router.get(
  "/search/query",
  authenticateUser(),
  contactController.searchNewContact
); // search contacts
router.post("/friend-request", authenticateUser(), contactController.addFriend); // send friend request
router.get(
  "/friend-request",
  authenticateUser(),
  contactController.getFriendRequests
); // get friend requests
router.put(
  "/friend-request",
  authenticateUser(),
  contactController.changeFriendRequestStatus
); // change friend request status

export default router;
