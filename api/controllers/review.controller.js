import createError from "../utils/createError.js";
import Review from "../modules/review.model.js";
import Gig from "../modules/gig.model.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller) {
    return next(createError(403, "Sellers can't create a review!"));
  }

  // Vérification si l'utilisateur a déjà créé un avis
 /* const existingReview = await Review.findOne({
    gigId: req.body.gigId,
    userId: req.userId,
  });

  if (existingReview) {
    return next(createError(403, "You have already created a review for this service!"));
  }*/

  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const savedReview = await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};



export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};
export const deleteReview = async (req, res, next) => {
  try {
      const reviewId = req.params.id;
      
    const review = await Review.findById(req.params.id);
    console.log("Review found:", review);
      
      if (!review) {
          return next(createError(404, "Review not found"));
      }

      if (review.userId !== req.userId) {
          return next(createError(403, "You are not authorized to delete this review"));
      }

      await Review.findByIdAndDelete(reviewId);

      await Gig.findByIdAndUpdate(review.gigId, {
          $inc: { totalStars: -review.star, starNumber: -1 },
      });

      res.status(200).send({ message: "Review deleted successfully" });
    } catch (err) {
      console.error("Error deleting review:", err);
      next(err);
    }
};

export const updateReview = async (req, res, next) => {
  const { desc, star } = req.body;

  try {
    console.log("Update Review ID:", req.params.id);
    const review = await Review.findById(req.params.id);
    if (!review) {
      console.log("Review not found");
      return next(createError(404, "Review not found"));
    }

    // Mettez à jour la critique
    review.desc = desc;
    review.star = star;
    await review.save();

    res.status(200).send({ message: "Review updated successfully" });
  } catch (err) {
    next(err);
  }
};

