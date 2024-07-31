// backend/controllers/userController.js
import User from '../models/user.model.js';

const serializeUser = data => ({
    id: data.id,
    username: data.username,
    email: data.email,
    img: data.img,
    country: data.country,
    isSeller: data.isSeller,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
});



export const findAllClients = async (req, res) => {
    try {
      const data = await User.find({ isSeller: false });
      const clients = await Promise.all(data.map(serializeUser));
      res.send(clients);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des clients."
      });
    }
  };

export const findPagination = async (req, res) => {
    const { page = 1, limit = 5, name = "", email = "" } = req.query;

    let query = {}
    if (email && email !== "null") {
        query =  { email : new RegExp(`${email}+`, "i") }
        
        if (name && name !== "null") {
            query = {
                $or: [ { email : new RegExp(`${email}+`, "i") } , { name: new RegExp(`${name}+`, "i") } ]
            }
        }
    }
    else if (name && name !== "null") {
        query = { name: new RegExp(`${name}+`, "i") }
    }

    const paginated = await User.paginate(
        query,
        {
            page,
            limit,
            lean: true,
            sort: { updatedAt: "desc" }
        }
    )
    
    const { docs } = paginated;
    const users = await Promise.all(docs.map(serializeUser));

    delete paginated["docs"];
    const meta = paginated

    res.json({ meta, users });
};

export const findOne = (req, res) => {
    User.findById(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            const user = serializeUser(data);
            res.send(user);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.id
            });
        });
};

export const create = (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
         return res.status(400).send({
             message: "Username, Email, and Password can not be empty"
         });
    }

    const user = new User({
        username: req.body.username.trim(),
        email: req.body.email.trim(),
        password: req.body.password.trim()
    });

    user.save()
        .then(data => {
            const user = serializeUser(data);
            res.send(user);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

export const update = (req, res) => {
    if (!req.body.username || !req.body.email) {
        return res.status(400).send({
            message: "Username and Email can not be empty"
        });
    }

    User.findByIdAndUpdate(req.params.id, {
        username: req.body.username.trim(),
        email: req.body.email.trim(),
    }, {new: true})
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            const user = serializeUser(data);
            res.send(user);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.id
            });
        });
};

export const remove = (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            res.send({ id: req.params.id, message: "User deleted successfully!" });
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.id
            });
        });
};
