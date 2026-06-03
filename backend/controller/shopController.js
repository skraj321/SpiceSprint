import Shop from "../models/ShopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;
    if (req.file) {
        console.log(req.file);
      image = await uploadOnCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ admin: req.user.id });
    if (!shop) {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        admin: req.user.id,
      });
    } else {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          image,
          admin: req.user.id,
        },
        { new: true },
      );
    }

    await shop.populate("admin items");
    return res.status(201).json(shop);
  } catch (err) {
    return res.status(500).json({ message: `create shop error ${err}` });
  }
};

export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ admin: req.user.id }).populate("admin items");
    if (!shop) {
      return res.status(404).json({
        msg: "Shop not found",
      });
    }
    return res.status(200).json(shop);
  } catch (err) {
    res.status(500).json({ msg: `get shop error ${err}` });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const shops = await Shop.find({
      city: { $regex: city, $options: "i" },
    }).populate("items");

    if (shops.length === 0) {
      return res.status(404).json({
        msg: "Shop not found",
      });
    }

    return res.status(200).json(shops);

  } catch (err) {
    res.status(500).json({
      msg: `Get shop error: ${err.message}`,
    });
  }
};