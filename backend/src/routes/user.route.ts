import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getSigleUser, updateUser, } from "../controllers/user.controller";

const router = Router();

router.get("/list", getAllUsers);
router.get("/single/:id", getSigleUser);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);


export default router;