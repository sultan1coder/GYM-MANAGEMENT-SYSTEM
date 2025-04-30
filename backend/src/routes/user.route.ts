import { Router } from "express";
import { deleteUser, getAllUsers, getSingleUser, updateUser, } from "../controllers/user.controller";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = Router();

router.get("/list", getAllUsers);
router.get("/single/:id", getSingleUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);


export default router;