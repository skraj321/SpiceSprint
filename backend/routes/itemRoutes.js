import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { isAuth } from "../middleware/authUser.js";
import { addItem, deleteItem, editItem, getItemByCity, getItemById, getItemsByShop, rating, searchItems } from "../controller/itemController.js";
import { upload } from "../middleware/multer.js";

const itemRouter = express.Router();

itemRouter.post("/add-item",isAuth,isAdmin,upload.single("image"),addItem);
itemRouter.post("/edit-item/:itemId",isAuth,isAdmin,upload.single("image"),editItem);
itemRouter.get("/get-by-id/:itemId",isAuth,getItemById);
itemRouter.delete("/item-delete/:itemId",isAuth,deleteItem);
itemRouter.get("/get-item-bycity/:city",isAuth,getItemByCity);
itemRouter.get("/get-item-byShop/:shopId",isAuth,getItemsByShop);
itemRouter.get("/search-items",isAuth,searchItems);
itemRouter.post("/rating",isAuth,rating);




export default itemRouter;