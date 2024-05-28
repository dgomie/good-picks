const router = require("express").Router();
const { where } = require("sequelize");
const { Rating, Artist, Music, User } = require("../../models");

// route to get all ratings
// router.get("/", async (req, res) => {
//   try {
//     const ratingData = await Rating.findAll({
//       include: [
//         {
//           model: user,
//           attributes: ["name", "profileImg"],
//         },
//         {
//           model: music,
//           attributes: ["song", "artist", "album"],
//         },
//       ],
//     });
//     const ratings = ratingData.map((rating) => rating.get({ plain: true }));
//     console.log(ratings);
//     res.status(200).send(ratings);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get("/:page", async (req, res) => {
  const limit = 9; // number of ratings per page
  const page = req.params.page || 1; // current page number, default to 1 if not provided
  const offset = (page - 1) * limit; // calculate the offset

  try {
    const ratingData = await Rating.findAll({
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']],
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

    if (ratingData.length === 0) {
      res.status(200).send('');
      return;
    }

    const ratings = ratingData.map((rating) => rating.get({ plain: true }));
    console.log(ratings);
  

    let songCards = ratings.map((rating) => {
      return `<div
      class="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-clip-border text-gray-700 shadow-none bg-slate-300 m-2 p-2 overflow-hidden"
    >
      <div
        class="relative flex items-center gap-4 pt-0 pb-8 mx-0 mt-4 overflow-hidden text-gray-700 shadow-none rounded-xl bg-clip-border"
      >
        <div class="flex w-full flex-col gap-0.5">
          <div class="flex items-center justify-between">
            <p
              class="font-sans text-l antialiased leading-snug tracking-normal text-blue-gray-100"
            >
              <a href="/profile/${rating.user.name}"><img
                  loading="lazy"
                  src="/images/alphabet/${rating.user.profileImg}-letter.512x512.png"
                  onerror="this.onerror=null; this.src='/images/alphabet/default-letter.512x512.png';"
                  alt=""
                  class="relative inline-block h-[30px] w-[30px] !rounded-full object-cover object-center m-1"
                />
              </a>
              <a
                class="hover:underline"
                href="/profile/${rating.user.name}"
              >${rating.user.name}</a>
            </p>
            <div id="cardBtns">
            <button data-modal-target="popup-modal" data-id="${rating.id}" data-modal-toggle="popup-modal" class="submit-rating opacity-20 hover:opacity-60" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14.078 7.061l2.861 2.862-10.799 10.798-3.584.723.724-3.585 10.798-10.798zm0-2.829l-12.64 12.64-1.438 7.128 7.127-1.438 12.642-12.64-5.691-5.69zm7.105 4.277l2.817-2.82-5.691-5.689-2.816 2.817 5.69 5.692z"/></svg></button>
            <button class="deleteRating opacity-20 hover:opacity-60 p-2" data-id="${rating.id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg></button>
          </div>
          </div>
          <div class="flex items-center justify-between">
            <h5
              class="block ml-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 overflow-hidden overflow-ellipsis whitespace-nowrap"
            >
              ${rating.music.title}
            </h5>
            <div class="flex items-center gap-0 mr-4 ml-1 text-md">
              ${rating.rating}
            </div>
          </div>
          <p
            class="block ml-2 font-sans text-base antialiased font-light leading-relaxed text-blue-gray-900"
          >
            ${rating.music.artist.name}
          </p>
        </div>
      </div>
    <div id="albumImagesContainer" class="flex items-center justify-center p-0 mb-6 w-[310px] h-[310px] mx-auto">
      <img
        src="${rating.music.albumImg}"
        alt="${rating.music.album} album art by ${rating.music.artist.name}"
        onerror="this.onerror=null; this.src='/images/missing-album.jpg';"
        loading="lazy"
        class="relative inline-block w-full h-full object-cover object-center m-1"
      />
    </div>
    </div>`
    });
    
    
    // Join all song cards into a single string
    let songCardsHTML = songCards.join('');
    res.status(200).send(songCardsHTML);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get one rating
router.get("/:id", async (req, res) => {
  try {
    const ratingData = await Rating.findByPk(req.params.id);
    if (!ratingData) {
      res.status(404).json({ message: "No rating found with this id!" });
      return;
    }
    res.status(200).json(ratingData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router to get all ratings by user
router.get("/user/:user_id", async (req, res) => {
  try {
    const ratingData = await Rating.findAll({
      where: { user_id: req.params.user_id },
    });
    if (!ratingData) {
      res.status(404).json({ message: "No ratings found with this user!" });
      return;
    }
    res.status(200).json(ratingData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get one rating by user
router.get("/user/:user_id/:id", async (req, res) => {
  try {
    const ratingData = await Rating.findOne({
      where: { user_id: req.params.user_id, id: req.params.id },
    });
    if (!ratingData) {
      res.status(404).json({ message: "No rating found with this user!" });
      return;
    }
    res.status(200).json(ratingData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// copilot mumbo jumbo, don't know if we need, but can be used as a reference for the future
// route to get average rating for a song
router.get("/average/:music_id", async (req, res) => {
  try {
    const ratingData = await Rating.findAll({
      where: { music_id: req.params.music_id },
    });
    if (!ratingData) {
      res.status(404).json({ message: "No ratings found for this song!" });
      return;
    }
    let total = 0;
    for (let i = 0; i < ratingData.length; i++) {
      total += ratingData[i].rating;
    }
    const average = total / ratingData.length;
    res.status(200).json(average);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to post new rating
router.post("/", async (req, res) => {
  try {
    const music = await Music.findOne({
      where: {
        title: req.body.songTitle,
        album: req.body.albumName,
      },
    });

    const existingRating = await Rating.findOne({
      where: {
        user_id: req.session.userId,
        music_id: music.id,
      },
    });

    if (!existingRating) {
      const newRating = await Rating.create({
        rating: req.body.rating,
        artist_id: music.artist_id,
        music_id: music.id,
        user_id: req.session.userId,
      });
      console.log("New Rating added to database", newRating);
      res.status(200).json(newRating);
    } else {
      console.log(
        "Rating for this song already exists for this user",
        existingRating
      );
      res.status(200).json(existingRating);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/", async (req, res) => {
  try {
    const ratingData = await Rating.destroy({
      where: {id: req.body.id },
    });
    if (!ratingData) {
      res.status(404).json({ message: "No rating found with this user!" });
      return;
    }
    res.status(200).json(ratingData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/", async (req, res) => {
  try {
    const [affectedRows] = await Rating.update(
      {
        rating: req.body.rating,
      },
      {
        where: {id: req.body.id},
      }
    );

    if (affectedRows === 0) {
      const rating = await Rating.findOne({ where: { id: req.body.id } });

      if (!rating) {
        res.status(404).json({ message: "No rating found with this id!" });
        return;
      }
    }

    res.status(200).json({ message: "Rating updated successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
