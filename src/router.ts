import {Router} from "express";

import {createUser, deleteAllUsers, deleteUserByEmail, listUsers} from "./controller/UserController";
import {createAccess, deleteAllAccess, getAllAccess} from "./controller/AccessController";
import {createStore, deleteAllStores, listStores} from "./controller/StoreController";
import {createProduct, deleteAllProducts, listProducts} from "./controller/ProductController";
import {signIn} from "./controller/SessionController";
import {authMiddleware} from "./middleware/AuthMiddleware";

export const router = Router();

router.post("/login", signIn);

router.post("/store/:userId", createStore);
router.post("/access", createAccess);
router.post("/users", createUser);
router.post("/product/:storeId", createProduct);

router.get("/users", listUsers);
router.get("/accesses", authMiddleware(["Administrador"]), getAllAccess);
router.get("/stores", listStores);
router.get("/products", listProducts);

router.delete("/users", deleteAllUsers);
router.delete("/users-by-email", deleteUserByEmail);
router.delete("/accesses", deleteAllAccess);
router.delete("/stores", deleteAllStores);
router.delete("/products", deleteAllProducts);