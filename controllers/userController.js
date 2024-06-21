const User = require("../models/customerSchema");
var moment = require("moment");
const { check, validationResult } = require("express-validator");
const AuthUser = require("../models/authUser");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");




const user_index_get = (req, res) => {
  // result ==> array of objects

  User.find()
    .then((result) => {
      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_edit_get = (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_view_get = (req, res) => {
  // result ==> object
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_search_post = (req, res) => {
  console.log("*******************************");

  const searchText = req.body.searchText.trim();

  User.find({ $or: [{ fireName: searchText }, { lastName: searchText }] })
    .then((result) => {
      console.log(result);
      res.render("user/search", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_delete = (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.redirect("/home");
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_put = (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body)
    .then((result) => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_add_get = (req, res) => {
  res.render("user/add");
};

const user_post = (req, res) => {
  User.create(req.body)
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

//level 2

const signout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

const welcome_get = (req, res) => {
  res.render("welcome");
};

const user_login_get = (req, res) => {
  res.render("auth/login");
};

const user_signup_get = (req, res) => {
  res.render("auth/signup");
};

const user_signup_post = async (req, res) => {
  try {
    //check error in Email and password
    const objError = validationResult(req);
    if (objError.errors.length > 0) {
      return res.json({ validationerror: objError.errors });
    }

    //validation Email if alreedy exist
    const isCurrentEmail = await AuthUser.findOne({ email: req.body.email });
    if (isCurrentEmail) {
      return res.json({ existemail: "Email already exist" });
    }

    //create newUser and login
    const result = await AuthUser.create(req.body);
    console.log(result);
    var token = jwt.sign({ id: result._id }, process.env.JWT_SECRET_KEY);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
    res.json({ id: result._id });
  } catch (error) {
    console.log(error);
  }
};

const user_login_post = async (req, res) => {
  try {
    //check Email if Exist
    const loginUser = await AuthUser.findOne({ email: req.body.email });
    if (loginUser == null) {
      res.json({ emailnotexist: "this email not found in DATABASE" });
    } else {
      // check password and login
      const match = await bcrypt.compare(req.body.password, loginUser.password);
      if (match) {
        var token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET_KEY);

        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json({ id: loginUser._id });
      } else {
        res.json({ invalidpassword: "wrong password" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  user_index_get,
  user_edit_get,
  user_view_get,
  user_search_post,
  user_delete,
  user_put,
  user_add_get,
  user_post,
  //level2
  signout_get,
  welcome_get,
  user_login_get,
  user_signup_get,
  user_signup_post,
  user_login_post,
};
