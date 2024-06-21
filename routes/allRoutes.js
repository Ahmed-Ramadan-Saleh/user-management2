const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const AuthUser = require("../models/authUser");
var jwt = require("jsonwebtoken");
var { requireAuth } = require("../middleware/middleware");
const { checkIfUser } = require("../middleware/middleware");
const { check, validationResult } = require("express-validator");


router.get("*", checkIfUser);

// Level 2

router.get("/signout", userController.signout_get);

router.get("/", userController.welcome_get);

router.get("/login", userController.user_login_get);

router.get("/signup", userController.user_signup_get);

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  userController.user_signup_post
);

router.post("/login", userController.user_login_post);

// Level 1
// GET Requst
router.get("/home", requireAuth, userController.user_index_get);

router.get("/edit/:id", requireAuth, userController.user_edit_get);

router.get("/view/:id", requireAuth, userController.user_view_get);

router.post("/search", userController.user_search_post);

// DELETE Request
router.delete("/edit/:id", userController.user_delete);

// PUT Requst
router.put("/edit/:id", userController.user_put);

module.exports = router;
