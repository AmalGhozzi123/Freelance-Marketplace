import Gig from "../modules/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig); 
  } catch (err) {
    next(err);
  }
};



export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};
export const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  const sortOption = q.sort || "createdAt";

  try {
    const gigs = await Gig.find(filters).sort({ [sortOption]: -1 });
    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};
// gig.controller.js

export const getGigsUser = async (req, res, next) => {
  const userId = req.params.userId; // Récupérer l'userId depuis les paramètres de la requête
  const filters = {
    ...(userId && { userId: userId }),
  };

  try {
    const gigs = await Gig.find(filters);
    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};

// gig.controller.js

export const updateGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found!"));

    if (gig.userId !== req.userId)
      return next(createError(403, "You can update only your gig!"));

    Object.assign(gig, req.body);

    const updatedGig = await gig.save();
    res.status(200).json(updatedGig);
  } catch (err) {
    next(err);
  }
};


