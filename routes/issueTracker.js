'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Issue = require('../models/issue');

//Sample front-end
router.get('/:project', (req, res) => {
    res.sendFile(process.cwd() + '/views/issue.html');
});
  
// API Route
router.route('/api/issues/:project')
    .get(async (req, res) => {
        if(!req.params.project) return res.json({error: 'Missing project name'});
        const {project} = req.params;
        let issueList;
        try {
            const query = Issue.find({project}).select('-project -__v');
            const fields = ['_id', 'issue_title', 'issue_text','created_by', 'assigned_to', 'status_text', 'created_on', 'updated_on'];
            fields.forEach(field => {
                if(req.query[field]) query.where(field).equals(req.query[field]);
            })
            if(typeof(req.query.open) === 'boolean') query.where('open').equals(req.query.open);
            issueList = await query.exec();
            res.json(issueList);
        } catch(err) {
            console.log(err.message);
            res.json({error: 'Could not get project issues'});
        }
    })
    .post(async (req, res) => {
        if(!req.params.project) return res.json({error: 'Missing project name'});
        const {project} = req.params;
        const fields = {...req.body, project};
        if(!fields.issue_title || !fields.issue_text || !fields.created_by) return res.json({error: 'required field(s) missing'});
        try {
            const newIssue = new Issue(fields);
            newIssue.save();
            res.json(newIssue);
        } catch(err) {
            console.log(err.message);
            res.json({error: 'Could not save new issue'});
        }
    })
    .put(async (req, res) => {
        if(!req.params.project) return res.json({error: 'Missing project name'});
        const {project} = req.params;
        try {
            if(!req.body._id) return res.json({error: 'missing _id'});
            const id = mongoose.Types.ObjectId(req.body._id);
            const fieldList = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text'];
            const fieldsToUpdate = fieldList.filter(field => req.body[field]);
            if(!fieldsToUpdate.length) return res.json({error: 'no update field(s) sent', _id: id});
            
            const issue = await Issue.findOne({_id: id, project}).select('-project -__v');
            if(!issue) throw new Error('Issue not found');
            fieldsToUpdate.forEach(field => {
                issue[field] = req.body[field];
            });
            if(req.body.open === 'false') issue.open = false;
            issue.updated_on = new Date();
            await issue.save();
            res.json({result: 'successfully updated', _id: id});
        } catch(err) {
            console.log('[Error]', err.message);
            res.json({error: 'could not update', _id: req.body._id});
        }
    })
    .delete(async (req, res) => {
        if(!req.params.project) return res.json({error: 'Missing project name'});
        const {project} = req.params;
        try {
            if(!req.body._id) return res.json({error: 'missing _id'});
            const id = mongoose.Types.ObjectId(req.body._id);
            const issue = await Issue.findOneAndDelete({_id: id, project}).select('-project -__v');
            if(!issue) throw new Error('Issue not found');
            res.json({result: 'successfully deleted', _id: id});
        } catch(err) {
            console.log('[Error]', err.message);
            res.json({error: 'could not delete', _id: req.body._id});
        }
    });
  
module.exports = router;