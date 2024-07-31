
import Freelancer from '../models/user.model.js';

const serializeFreelancer = data => ({
    id: data.id,
    username: data.username,
    email: data.email,
    img: data.img,
    country: data.country,
    phone: data.phone,
    desc: data.desc,
    isSeller: data.isSeller,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
});


export const findAllFreelancers = async (req, res) => {
    try {
        const data = await Freelancer.find({ isSeller: true });
        const freelancers = await Promise.all(data.map(serializeFreelancer));
        res.send(freelancers);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Une erreur s'est produite lors de la récupération des freelancers."
        });
    }
};


export const findFreelancerById = async (req, res) => {
    try {
        const data = await Freelancer.findById(req.params.id);
        if (!data) {
            return res.status(404).send({
                message: "Freelancer not found with id " + req.params.id
            });
        }
        const freelancer = serializeFreelancer(data);
        res.send(freelancer);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Freelancer not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving freelancer with id " + req.params.id
        });
    }
};
export const createFreelancer = (req, res) => {
    if (!req.body.username || !req.body.email) {
         return res.status(400).send({
             message: "Username and Email can not be empty"
         });
    }

    const freelancer = new Freelancer({
        username: req.body.username.trim(),
        email: req.body.email.trim(),
    });

    freelancer.save()
        .then(data => {
            const savedFreelancer = serializeFreelancer(data);
            res.send(savedFreelancer);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Freelancer."
            });
        });
};

export const updateFreelancer = (req, res) => {
    if (!req.body.username || !req.body.email) {
        return res.status(400).send({
            message: "Username and Email can not be empty"
        });
    }

    Freelancer.findByIdAndUpdate(req.params.id, {
        username: req.body.username.trim(),
        email: req.body.email.trim(),
        phone: req.body.phone || "",
        desc: req.body.desc || "",
        isSeller: req.body.isSeller || false,
    }, {new: true})
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: "Freelancer not found with id " + req.params.id
                });
            }
            const updatedFreelancer = serializeFreelancer(data);
            res.send(updatedFreelancer);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Freelancer not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating freelancer with id " + req.params.id
            });
        });
};

export const removeFreelancer = (req, res) => {
    Freelancer.findByIdAndRemove(req.params.id)
        .then(freelancer => {
            if (!freelancer) {
                return res.status(404).send({
                    message: "Freelancer not found with id " + req.params.id
                });
            }
            res.send({ id: req.params.id, message: "Freelancer deleted successfully!" });
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Freelancer not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete freelancer with id " + req.params.id
            });
        });
};
