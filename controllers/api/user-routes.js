const router = require("express").Router();
const { User } = require("../../models");

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log(userData)

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

  req.session.userId = userData.id;
  req.session.loggedIn = true;
  req.session.username = userData.name;
  req.session.profileImg = userData.profileImg;
  req.session.email = userData.email;

  await req.session.save(err => {
    if (err) {
      // handle error
      res.status(500).json(err);
    } else {
      res.json({ user: userData, message: "You are now logged in!" });
    }
  });
} catch (err) {
  res.status(400).json(err);
}
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // replace 'session-cookie-name' with the name of your session cookie
      console.log('session ended')
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// get all users minus their passwords
router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      order: [["name", "asc"]],
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new user
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const userData = await User.findOne({ where: { email: req.body.email } });

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;
      req.session.username = userData.name;
      req.session.profileImg = userData.profileImg;
      req.session.email = userData.email;

      res.status(200).json(newUser);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;