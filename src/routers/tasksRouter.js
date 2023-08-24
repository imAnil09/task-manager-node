const express = require('express');
const router = new express.Router();
const Tasks = require('../models/taskCreation');


router.post('/task-creation', (req, res) => {
    const task = new Tasks(req.body);

    task.save().then(() => {
        res.status(201).send(task)
    }).catch(err => {
        res.status(400).send(err);
    })
})

router.get('/tasks', (req, res) => {
    Tasks.find().then(task => {
        res.status(200).send(task);
    }).catch(err => {
        res.status(400).send(err);
    })
})

router.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;

    Tasks.findById(_id)
        .then(task => {
            if (!task) {
                return res.status(404).send()
            }
            res.status(200).send(task)
        })
        .catch(err => {
            res.status(500).send(err)
        })

})

router.patch('/tasks/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ 'error': 'Invalid updates' })
    }

    try {
        // const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        const task = await Tasks.findById(req.params.id);

        updates.forEach(update => task[update] = req.body[update])

        await task.save()

        if (!task) {
            return res.status(404).send('Task not found!');
        }
        res.send(task);
    }
    catch (e) {
        res.status(400).send(e)
    }

})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;