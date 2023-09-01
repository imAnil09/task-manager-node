const express = require('express');
const User = require('../models/user');
const { update } = require('../models/taskCreation');
const auth = require('../middleware/auth');
const router = new express.Router();



router.post('/users', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()

        const token = await user.generateAuthToken();

        // console.log(token)
        
        res.status(201).send({user, token})
    }
    catch (err) {

        res.status(400)
        res.send(err)
    }
})

router.post('/users/login', async function (req, res) {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token })
    }
    catch (e) {
        res.send('Unable to login!')
    }
})

router.get('/users/me', auth, (req, res) => {
     res.send(req.user);
})

router.get('/users/:id', (req, res) => {
    // const _id = new ObjectID(req.params.id);
    const _id = req.params.id;
    // User.findOne({_id: new ObjectID(req.params.id)})
    User.findById(_id)
        .then(user => {
            if (!user) {
                return res.status(404).send()
            }
            res.status(200).send(user)
        })
        .catch(err => {
            res.status(500).send()
        })
    console.log(req.params.id)
})

router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'role', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ 'error': 'Invalid updates' })
    }

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidator: true });

        const user = await User.findById(req.params.id);

        updates.forEach(update => {
            user[update] = req.body[update]
        })

        await user.save()

        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
        console.log(req.body)
    }
})

router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
        // console.log(user)

    }
    catch (e) {
        res.status(500).send();
    }
})

module.exports = router;