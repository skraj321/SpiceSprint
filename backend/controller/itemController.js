import Item from "../models/Items.js";
import Shop from "../models/ShopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ admin: req.user.id });
    if (!shop) {
      return res.status(400).json({ msg: "shop not found" });
    }
    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });
    shop.items.push(item._id);
    await shop.save();
    await shop.populate("items admin");
    return res.status(201).json({
      item,
      shop,
    });
  } catch (err) {
    res.status(500).json({ msg: `add item error:${err}` });
  }
};

export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        image,
      },
      { new: true },
    );
    if (!item) {
      return res.status(400).json({ msg: "item not found" });
    }
    const shop = await Shop.findOne({ admin: req.user.id }).populate("items");
    return res.status(200).json({
      item,
      shop,
    });
  } catch (err) {
    res.status(500).json({ msg: `edit item error:${err}` });
  }
};

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ msg: "item not found" });
    }
    return res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ msg: `edit item error:${err}` });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        msg: "Item not found",
      });
    }

    // Remove item from shop items array
    await Shop.findByIdAndUpdate(item.shop, {
      $pull: {
        items: itemId,
      },
    });

    // Delete item
    await Item.findByIdAndDelete(itemId);

    const updatedShop = await Shop.findById(item.shop).populate("items");

    res.status(200).json({
      msg: "Item deleted successfully",
      shop: updatedShop,
    });
  } catch (err) {
    res.status(500).json({
      msg: `Server Error: ${err.message}`,
    });
  }
};

export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(404).json({
        msg: "City is required",
      });
    }
    const shops = await Shop.find({
      city: { $regex: city, $options: "i" },
    }).populate("items");

   const shopIds = shops.map((shop)=>shop._id)
   const items = await Item.find({shop:{$in:shopIds}})
   return res.status(200).json(items)
  } catch (err) {
    res.status(500).json({
      msg: `GEt item by city error: ${err.message}`,
    });
  }
};

export const getItemsByShop=async(req,res)=>{
  try{
    const {shopId} = req.params
    const shop=await Shop.findById(shopId)
    .populate("items")

    if(!shop){
      return res.status(400).json("shop not found")
    }
    return res.status(200).json({
      shop,
      items:shop.items
    })
  }catch(err){
    res.status(500).json({
      msg: `GEt item by shop error: ${err.message}`,
    });
  }
}
export const searchItems=async(req,res)=>{
  try{
    const {query,city}=req.query
    if(!query || !city){
      return null
    }
    const shops=await Shop.find({
      city:{$regex:new RegExp(`^${city}$`,"i")}
    }).populate('items')
    if(!shops){
      return res.status(400).json({
        message:"shops not found"
      })
    }
    const shopIds=shops.map(s=>s._id)
    const items=await Item.find({
      shop:{$in:shopIds},
      $or:[
        {name:{$regex:query,$options:"i"}},
        {category:{$regex:query,$options:"i"}}
      ]
    }).populate("shop","name image")

    return res.status(200).json(items)
  }catch(err){
    res.status(500).json({
      msg: `search Item error: ${err.message}`,
    });
  }
}
export const rating=async(req,res)=>{
    try{
        const {itemId, rating}=req.body
        if(!itemId || !rating){
          return res.status(400).json({message:"itemId and rating are required"})
        }
        if(rating<1 || rating>5){
          return res.status(400).json({message:"rating must be between 1 and 5"})
        }
        const item=await Item.findById(itemId)
        if(!item){
          return res.status(400).json({message:"item not found"})
        }
        const newCount=item.rating.count+1
        const newAverage= ((item.rating.average*item.rating.count)+rating)/newCount
        item.rating.count=newCount
        item.rating.average=newAverage
        await item.save()
        return res.status(200).json({message:"Rating submitted successfully", rating:item.rating})
    }catch(err){
        return res.status(500).json({error: "Rating Server Error", err});
    }
}