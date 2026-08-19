import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { updateProfileSchema, changePasswordSchema } from "../utils/validators.js";
import {
  getUserProfileController,
  updateUserProfileController,
  uploadAvatarController,
  changePasswordController,
  deleteAccountController,
  toggleWishlistController,
  toggleWishlistByNameController,
  getWishlistController,
  removeWishlistItemController,
  updateTravelDNAController,
} from "../controllers/userController.js";

const router = Router();
router.use(verifyJWT);

router.get("/profile", getUserProfileController);
router.patch("/profile", validate(updateProfileSchema), updateUserProfileController);
router.post("/avatar", upload.single("image"), uploadAvatarController);
router.post("/change-password", validate(changePasswordSchema), changePasswordController);
router.delete("/delete-account", deleteAccountController);

router.get("/wishlist", getWishlistController);
router.post("/wishlist/:destinationId", toggleWishlistController);
router.post("/wishlist-by-name", toggleWishlistByNameController);
router.delete("/wishlist/item/:id", removeWishlistItemController);

router.post("/travel-dna", updateTravelDNAController);

export default router;
