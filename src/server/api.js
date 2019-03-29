const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Task = mongoose.model('Task');
const List = mongoose.model('List');
const Description = mongoose.model('Description');

router.post('/register', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) { 
            res.status(500).json(err);
            console.error(`Failed to register account '${req.body.username}'.`);
            return;
        }
        if (user) { 
            res.status(409).json({ 'message': 'User already exists.' });
            console.error(`Failed to register account; '${req.body.username}' ` + 
                    `already exists.`);
            return; 
        }
        if (!user) {
            let defaultListID;
            const newList = new List();
            newList.username = req.body.username;
            newList.name = 'Default List';
            newList.save(function(err) {
                if (err) {
                    console.error('Failed to add default list.');
                    res.status(500).send('Failed to register user; ' + 
                            'failed to add default list.');
                    return;
                }
            });

            console.log(newList._id);

            const newUser = new User();
            newUser.username = req.body.username;
            newUser.setPassword(req.body.password);
            newUser.mostRecentListID = newList._id;
            newUser.save(err => {
                const token = newUser.generateJWT();
                res.status(200).json({ 'token': token });
                console.log(`Registered account '${req.body.username}'.`);
            });
        }
    });
}).post('/login', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {  
            res.status(500).json(err);
            return;
        }
        if (user) {
            const token = user.generateJWT();
            res.status(200).json({ 'token': token });
            console.log(`'${req.body.username}' logged in.`);
        } else {
            res.status(404).json(info);
            console.error(`Failed to log in '${req.body.username}'`)
        }
    })(req, res);
}).put('/user', (req, res) => {
    User.findById(req.body._id, (err, user) => {
        if (err) {
            res.status(500).send('Failed to find and update user.');
            return;
        }
        user.mostRecentListID = req.body.mostRecentListID;
        user.save(err => {
            if (err) {
                res.status(500).send('Failed to update user.');
                return;
            }
            const token = user.generateJWT();
            res.status(200).json({ 'token': token });
        });
    });
}).put('/password', (req, res) => {
    User.findOne({ username: req.body.username}, (err, user) => {
        if (err) {
            const err = 'Failed to find user "' + req.body.username + '".';
            res.status(500).json(err);
            console.error(err);
            return;
        }
        user.setPassword(req.body.password);
        user.save(err => {
            if (err) {
                const err = 'Failed to save password.';
                res.status(500).json(err);
                console.error(err);
                return;
            }
            res.status(200).json(user);
            console.log('Saved new password for user "' + 
                    req.body.username + '".');
        });
    });
});

router.post('/task', (req, res) => {
    Task.create({
        title: req.body.title,
        isComplete: req.body.isComplete,
        goalDate: req.body.goalDate,
        listID: req.body.listID
    }, (err, task) => {
        if (err) { 
            res.status(500).send('Failed to add task "' + req.body.title + '".');
            return;
        }

        if (req.body.description && req.body.description !== '') {
            Description.create({
                taskID: task._id,
                content: req.body.description
            }, (err, description) => {
                if (err) {
                    const errorMessage = 'Failed to add description for task "' +
                            req.body.title + '".';
                    res.status(500).send(errorMessage);
                    console.error(errorMessage);
                    return;
                }
            });
        }
        res.status(200).json(task);
        console.log('Added task "' + req.body.title + '" for user "' +
                req.body.username + '".');
    });
}).put('/task', (req, res) => {
    Task.findById(req.body.original._id, (err, task) => {
        if (err) {
            const errorMessage = 'Failed to find and update task "' + 
                    req.body.original._id + '".';
            res.status(500).send(errorMessage);
            console.error(errorMessage);
            return;
        }

        task.isComplete =  req.body.update.isComplete;
        task.isArchived = req.body.update.isArchived;
        task.save(err => {
            if (err) {
                const errorMessage = 'Failed to save updated task "' + 
                        task._id + '".'
                res.status(500).send(errorMessage);
                console.error(errorMessage);
                return;
            }
            res.status(200).json(task);
            console.log('Updated task "' + task._id + '".');
        });
    });
}).delete('/tasks', (req, res) => {
    console.log(req.query);
    if (req.query._id instanceof Array) {
        Task.deleteMany({ _id: { $in: req.query._id }}, (err, tasks) => {
            if (err) {
                const errorMessage = 'Failed to remove tasks.';
                res.status(500).send(errorMessage);
                console.error(errorMessage)
            }
            res.status(200).json('Removed tasks.');
            console.log('Removed tasks.');
        });
    } else {
        Task.findByIdAndDelete(req.query._id, (err, task) => {
            if (err) {
                const errorMessage = 'Failed to find and remove task"' + 
                        _id + '".';
                res.status(500).send(errorMessage);
                console.error(errorMessage)
                return;
            }
            res.status(200).json('Removed tasks.');
            console.log('Removed task "' + task.title + '".');
        });
    }
}).post('/list', (req, res) => {
    List.create({
        username: req.body.username,
        name: req.body.name
    }, (err, list) => {
        if (err) {
            const errorMessage = 'Failed to add list "' + req.body.name + 
                    '" for user "' + req.body.username + '".';
            res.status(500).send(errorMessage);
            console.error(errorMessage);
            return;
        }
        res.status(200).json(list);
        console.log('Added list "' + req.body.name + '" for user "' + 
                req.body.username + '".');
    });
}).delete('/list/:listID', (req, res) => {
    List.findByIdAndDelete(req.params.listID, (err, list) => {
        if (err) {
            const errorMessage = 'Failed to find and remove list.';
            res.status(500).send(errorMessage);
            console.error(errorMessage);
            return;
        }
        Task.find({ listID: list._id }, (err, tasks) => {
            if (err) {
                const errorMessage = 'Failed to find tasks for list "' + 
                        req.params._id + '".';
                res.status(500).send(errorMessage);
                console.error(errorMessage);
                return;
            }
            console.log('Found tasks for list "' + req.params._id + '".');
            for (let task of tasks) {
                Task.findByIdAndRemove(task._id, (err, removedTask) => {
                    if (err) {
                        const errorMessage = 'Failed to remove task "' + 
                                task.title + '".';
                        res.status(500).send(errorMessage);
                        console.error(errorMessage);
                        return;
                    }
                    console.log('Removed task "' + removedTask.title + '".');
                });
            }
        });

        res.status(200).json(list);
        console.log('Removed list "' + list.name + '".');
    });
}).get('/:listID/tasks', (req, res) => {
    Task.find({ listID: req.params.listID }, (err, tasks) =>{
        if (err) {
            const errorMessage = 'Failed to find tasks for list ID "' + 
                    req.params.listID + '".';
            res.status(500).send(errorMessage);
            console.error(errorMessage);
            return;
        }
        res.status(200).json(tasks);
        console.log('Send tasks for list "' + req.params.listID + '".');
    });
}).get('/default_list/:username', (req, res) => {
    List.findOne({ 
                name: 'Default List', 
                username: req.params.username 
            }, (err, list) => {
        if (err) {
            const errorMessage = 'Failed to find default list for user "' +
                    req.params.username + '".';
            res.status(404).send(errorMessage);
            console.error(errorMessage);
            return;
        }
        res.status(200).json(list);
        console.log('Sent default list for "' + req.params.username + '".');
    });
}).get('/lists/:username', (req, res) => {
    List.find({ username: req.params.username }, (err, lists) => {
        if (err) { 
            const errorMessage = 'Failed to find lists for user "' +
                    req.params.username + '".';
            res.status(500).send(errorMessage)
            console.error(errorMessage);
            return;
        }
        res.status(200).json(lists);
        console.log('Sent lists for "' + req.params.username + '".');
    });
});

module.exports = router;
