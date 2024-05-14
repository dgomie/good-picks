const router = require("express").Router();
const { User, Music, Rating, Artist } = require("../models");
const withAuth = require("../utils/auth");
// homepage
router.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }
  res.render("homepage", {
    title: "Good Picks",
  });
});
// login page
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login", {
    title: "Login",
    loggedIn: req.session.loggedIn,
  });
});
// registration page
router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register",
    loggedIn: req.session.loggedIn,
  });
});
//user dashboard
// TODO: put back withAuth
//currently trying to render album art in dashboard songcards
router.get("/dashboard", async (req, res) => {
  console.log(req.session);
  try {
    const dbRatingData = await Rating.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "profileImg"],
        },
        {
          model: Music,
          attributes: ["title", "album", "albumImg"],
          include: [
            {
              model: Artist,
              attributes: ["name"],
            },
          ],
        },
      ],
    });
    const ratings = dbRatingData.map((rating) => rating.get({ plain: true }));
    console.log(ratings);
    res.render("dashboard", {
      title: "Dashboard",
      ...req.session,
      ratings,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// user profile
// TODO: put back withAuth
router.get("/profile", (req, res) => {
  res.render("profile", {
    title: "Profile",
    ...req.session,
  });
});
router.get("/logout", (req, res) => {
  res.render("logout");
});
router.get("/charts", (req, res) => {
  res.render("charts", {
    title: "Charts",
    ...req.session,
  });
});
router.get("/music", (req, res) => {
  res.render("music");
});
module.exports = router;














