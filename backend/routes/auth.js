// All the required imports

const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { body, validationResult, check } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const { data } = require("autoprefixer");

// Creating a Router using Express
const router = express.Router();


// Route 1 : To Create  a User PORT : api/auth/createuser

router.post(
  "/createuser",
  [
    body("Name", "Enter a Valid Name").isLength({ min: 3 }),
    body("Email", "Enter a Valid Email").isEmail(),
    body("Password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let Check = false;

    // IF there will be any error it will validate and check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Check, errors: errors.array() });
    }

    // Now Checking if there is no other user existing with the same email
    let user = await User.findOne({ Email: req.body.Email });
    if (user) {
      return res
        .status(400)
        .json({ Check, error: "Username and email already exist." });
    }

    // Now if it passes all the tests

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.Password, salt);

    user = await User.create({
      Name: req.body.Name,
      Email: req.body.Email,
      Password: hashedpassword,
      isadmin : false
    })
      .then((user) => {
        const data = {
          user: {
            id: user.id,
          },
        };
        Check = true;
        const authtoken = jwt.sign(data, JWT);
        res.json({ Check, authtoken });
      })
      .catch((err) => {
        console.log("Error Has Recieved");
        res.status(500).send("Internal Error");
      });
  }
);

//Route 2 : To Authenticate and login the user

router.post(
  "/login",
  [
    body("Email", "Enter a Valid Email").isEmail(),
    body("Password", "Password Cannot be Blank").exists(),
  ],
  async (req, res) => {
    let Check = false;

    // Again we will check for errors first

    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ Check, errors: errors.array() });
      }

      const { Email, Password } = req.body;

      // Now for the Validation part first we will check if the entered email exist or not

      let user = await User.findOne({ Email });
      if (!user) {
        return res.status(400).json({
          Check,
          error: "Please Check Wheather the Email and the Password are Correct",
        });
      }

      // Now if user exist then we will check for the given password

      let passcomp = await bcrypt.compare(Password, user.Password);

      if (!passcomp) {
        return res.status(400).json({
          Check,
          error: "Please Check Wheather the Email and the Password are Correct",
        });
      }

      // Now if the Password is Correct we will Generate a auth token for the user

      const data = {
        user: {
          id: user.id,
        },
      };
      Check = true;
      const status = user?.isadmin ; 
      const authtoken = jwt.sign(data, JWT);
      res.json({ Check, authtoken , status });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal  error Occured");
    }
  }
);

// Route 3 : To get the User details

router.get("/fetchuser", fetchuser, async (req, res) => {
  try {
    let userID = req.user.id;
    const user = await User.findById(userID).select("-Password"); 
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Error Occurred");
  }
});


// Route 4 : To check wheather user Exist

router.post(
  "/find",
  [body("Email", "Enter a Valid Email").isEmail()],
  async (req, res) => {
    let Check = false;

    // Again we will check for errors first

    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ Check, errors: errors.array() });
      }

      const { Email } = req.body;

      // Now for the Validation part first we will check if the entered email exist or not

      let user = await User.findOne({ Email });
      if (!user) {
        return res.status(400).json({
          Check,
          error: "User do not exist",
        });
      }

      // Now if user exist then we will check for the given password
      Check = true;
      const data = {
        user: {
          id: user.id,
        },
      };
      Check = true;
      const authtoken = jwt.sign(data, JWT);
      res.json({ Check, authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal  error Occured");
    }
  }
);

// Route 5 : To Change the Password

router.post(
  "/changepassword",
  async (req, res) => {
    let Check  = false ;
    // Again we will check for errors first
    const {token , Password} =  req.body;
    try {
        const data = jwt.verify(token , JWT);
        const userID = data.user.id;
        const user = await User.findById(userID);
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(Password, salt);
        user.Password = hashedpassword ;
        user.save();
        Check = true ; 
        res.send({Check , user});
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal  error Occured");
    }
  }
);

module.exports = router;


// Route 6 : To create a Admin

router.post(
  "/createadmin",
  [
    body("Name", "Enter a Valid Name").isLength({ min: 3 }),
    body("Email", "Enter a Valid Email").isEmail(),
    body("Password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let Check = false;

    // IF there will be any error it will validate and check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Check, errors: errors.array() });
    }

    // Now Checking if there is no other user existing with the same email
    let user = await User.findOne({ Email: req.body.Email });
    if (user) {
      return res
        .status(400)
        .json({ Check, error: "User with same email exist" });
    }

    // Now if it passes all the tests

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.Password, salt);

    user = await User.create({
      Name: req.body.Name,
      Email: req.body.Email,
      Password: hashedpassword,
      isadmin : true
    })
      .then((user) => {
        const data = {
          user: {
            id: user.id,
          },
        };
        Check = true;
        const authtoken = jwt.sign(data, JWT);
        res.json({ Check, authtoken });
      })
      .catch((err) => {
        console.log("Error Has Recieved");
        res.status(500).send("Internal Error");
      });
  }
);