import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { isAuth } from "../middleware/authUser.js";
import  {createEditShop, getMyShop, getShopByCity } from "../controller/shopController.js";
import { upload } from "../middleware/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create-edit",isAuth,isAdmin,upload.single("image"),createEditShop);
shopRouter.get("/get-shop",isAuth,getMyShop);
shopRouter.get("/get-by-city/:city",isAuth,getShopByCity);


export default shopRouter;