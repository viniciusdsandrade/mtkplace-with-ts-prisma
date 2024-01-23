import {Router} from "express";

import {createUser, deleteAllUsers, deleteUserByEmail, listUsers} from "./controller/UserController";
import {createAccess, getAllAccess} from "./controller/AccessController";

export const router = Router();

router.post("/users", createUser);
router.delete("/users", deleteAllUsers);
router.get("/users", listUsers);
router.delete("/users-by-email", deleteUserByEmail);


router.post("/access", createAccess);
router.get("/access", getAllAccess);