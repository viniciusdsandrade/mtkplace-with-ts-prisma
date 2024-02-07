import {Router} from "express";

import {createUser, deleteAllUsers, deleteUserByEmail, getUserById, listUsers} from "./controller/UserController";
import {createAccess, deleteAllAccess, getAllAccess} from "./controller/AccessController";
import {createStore, deleteAllStores, listStores} from "./controller/StoreController";
import {createProduct, deleteAllProducts, listProducts} from "./controller/ProductController";
import {signIn} from "./controller/SessionController";
import {authMiddleware} from "./middleware/AuthMiddleware";
import {createSale, getAllSales} from "./controller/SellerController";

export const router = Router();

/*
    // Definindo os middlewares de permissão
    const permissionAll = authMiddleware(["Administrador", "Vendedor", "Comprador"]);
    const permissionAdmin = authMiddleware(["Administrador"]);
    const permissionAdminVendedor = authMiddleware(["Administrador", "Vendedor"]);

    // Agrupando as rotas com as permissões correspondentes
    router.post("/login", signIn);

    // Rotas de criação
    router.post("/store/:userId", permissionAdminVendedor, createStore);
    router.post("/access", permissionAdmin, createAccess);
    router.post("/users", createUser);
    router.post("/product/:storeId", permissionAdminVendedor, createProduct);

    // Rotas de leitura
    router.get("/users", permissionAdmin, listUsers);
    router.get("/user/:id", permissionAdmin, getUserById);
    router.get("/accesses", permissionAdmin, getAllAccess);
    router.get("/stores", permissionAll, listStores);
    router.get("/products", permissionAll, listProducts);

    // Rotas de exclusão
    router.delete("/users", deleteAllUsers);
    router.delete("/users-by-email", permissionAdmin, deleteUserByEmail);
    router.delete("/accesses", permissionAdmin, deleteAllAccess);
    router.delete("/stores", permissionAdmin, deleteAllStores);
    router.delete("/products", permissionAdminVendedor, deleteAllProducts);
 */

router.post("/login", signIn);

router.post("/store/:userId", createStore);
router.post("/access", createAccess);
router.post("/users", createUser);
router.post("/product/:storeId", createProduct);
router.post("/create-sale", authMiddleware(["Administrador", "Vendedor", "Comprador"]), createSale);

router.get("/users", listUsers);
router.get("/user/:id", getUserById);
router.get("/accesses", getAllAccess);
router.get("/stores", listStores);
router.get("/products", listProducts);
router.get("/get-all-sales", authMiddleware(["Administrador", "Vendedor", "Comprador"]), getAllSales);

router.delete("/users", deleteAllUsers);
router.delete("/users-by-email", deleteUserByEmail);
router.delete("/accesses", deleteAllAccess);
router.delete("/stores", deleteAllStores);
router.delete("/products", deleteAllProducts);
