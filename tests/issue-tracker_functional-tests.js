const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { expect } = require('chai');

const Issue = require('../models/issue');

chai.use(chaiHttp);

suite('Issue Tracker Functional Tests', function() {
    this.timeout(10000);
    suite('HTTP Requests', () => {
        let testIssueID;
        // Create an issue with every field: POST request to /api/issues/{project}
        test('Test POST /api/issues/{project} with all fields', done => {
            chai.request(server)
                .post('/issue-tracker/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isDefined(res.body._id);
                    assert.isString(res.body.issue_title);
                    assert.isString(res.body.issue_text);
                    assert.isString(res.body.created_by);
                    assert.isString(res.body.assigned_to);
                    assert.isString(res.body.status_text);
                    assert.isDefined(res.body.created_on);
                    assert.isDefined(res.body.updated_on);
                    assert.isBoolean(res.body.open);
                    testIssueID = res.body._id;
                    done();
                });
        });           
        // Create an issue with only required fields: POST request to /api/issues/{project}
        test('Test POST /api/issues/{project} with only required fields', done => {
            chai.request(server)
                .post('/issue-tracker/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required field',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isDefined(res.body._id);
                    assert.isString(res.body.issue_title);
                    assert.isString(res.body.issue_text);
                    assert.isString(res.body.created_by);
                    assert.strictEqual(res.body.assigned_to, '');
                    assert.strictEqual(res.body.status_text, '');
                    assert.isDefined(res.body.created_on);
                    assert.isDefined(res.body.updated_on);
                    assert.isBoolean(res.body.open);
                    testIssueID = res.body._id;
                    done();
                });
        });          
        // Create an issue with missing required fields: POST request to /api/issues/{project}
        test('Test POST /api/issues/{project} with missing required fields', done => {
            chai.request(server)
                .post('/issue-tracker/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'required field(s) missing');
                    done();
                });
        });       
        // View issues on a project: GET request to /api/issues/{project}
        test('Test GET /api/issues/{project}', done => {
            chai.request(server)
                .get('/issue-tracker/api/issues/test')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                        assert.isObject(issue);
                        assert.isDefined(issue._id);
                        assert.isString(issue.issue_title);
                        assert.isString(issue.issue_text);
                        assert.isString(issue.created_by);
                        assert.isString(issue.assigned_to);
                        assert.isString(issue.status_text);
                        assert.isDefined(issue.created_on);
                        assert.isDefined(issue.updated_on);
                        assert.isBoolean(issue.open);
                    });
                    done();
                });
        });
        // View issues on a project with one filter: GET request to /api/issues/{project}
        test('Test GET /api/issues/{project} with one filter', done => {
            chai.request(server)
                .get('/issue-tracker/api/issues/test?open=true')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                        assert.isObject(issue);
                        assert.isDefined(issue._id);
                        assert.isString(issue.issue_title);
                        assert.isString(issue.issue_text);
                        assert.isString(issue.created_by);
                        assert.isString(issue.assigned_to);
                        assert.isString(issue.status_text);
                        assert.isDefined(issue.created_on);
                        assert.isDefined(issue.updated_on);
                        assert.isTrue(issue.open);
                    });
                    done();
                });
        });
        // View issues on a project with multiple filters: GET request to /api/issues/{project}
        test('Test GET /api/issues/{project} with multiple filters', done => {
            chai.request(server)
                .get('/issue-tracker/api/issues/test?open=true&issue_title=Title')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                        assert.isObject(issue);
                        assert.isDefined(issue._id);
                        assert.isString(issue.issue_title);
                        assert.isString(issue.issue_text);
                        assert.isString(issue.created_by);
                        assert.isString(issue.assigned_to);
                        assert.isString(issue.status_text);
                        assert.isDefined(issue.created_on);
                        assert.isDefined(issue.updated_on);
                        assert.isTrue(issue.open);
                    });
                    done();
                });
        });
        // Update one field on an issue: PUT request to /api/issues/{project}
        test('Test PUT /api/issues/{project} to update one field', done => {
            chai.request(server)
                .put('/issue-tracker/api/issues/test')
                .send({
                    _id: testIssueID,
                    issue_title: 'New Title',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    Issue.findById(testIssueID).then(issue => {
                        assert.isAbove(Date.parse(issue.updated_on), Date.parse(issue.created_on), 'updated_on field on issue should be changed');
                    });
                    assert.strictEqual(res.body.result, 'successfully updated');
                    assert.strictEqual(res.body._id, testIssueID);
                    done();
                });
        });
        // Update multiple fields on an issue: PUT request to /api/issues/{project}
        test('Test PUT /api/issues/{project} to update multiple field', done => {
            chai.request(server)
                .put('/issue-tracker/api/issues/test')
                .send({
                    _id: testIssueID,
                    issue_title: 'Second New Title',
                    issue_text: 'New Text',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    Issue.findById(testIssueID).then(issue => {
                        assert.isAbove(Date.parse(issue.updated_on), Date.parse(issue.created_on), 'updated_on field on issue should be changed');
                    });
                    assert.strictEqual(res.body.result, 'successfully updated');
                    assert.equal(res.body._id, testIssueID);
                    done();
                });
        });
        // Update an issue with missing _id: PUT request to /api/issues/{project}
        test('Test PUT /api/issues/{project} with missing _id', done => {
            chai.request(server)
                .put('/issue-tracker/api/issues/test')
                .send({
                    issue_title: 'New Title',
                    issue_text: 'New Text',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'missing _id');
                    done();
                });
        });
        // Update an issue with no fields to update: PUT request to /api/issues/{project}
        test('Test PUT /api/issues/{project} with no fields to update', done => {
            chai.request(server)
                .put('/issue-tracker/api/issues/test')
                .send({_id: testIssueID})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'no update field(s) sent');
                    assert.equal(res.body._id, testIssueID);
                    done();
                });
        });
        // Update an issue with an invalid _id: PUT request to /api/issues/{project}
        test('Test PUT /api/issues/{project} with an invalid _id', done => {
            chai.request(server)
                .put('/issue-tracker/api/issues/test')
                .send({_id: 'heyooo', issue_title: 'New Title'})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'could not update');
                    assert.equal(res.body._id, 'heyooo');
                    done();
                });
        });
        // Delete an issue: DELETE request to /api/issues/{project}
        test('Test DELETE /api/issues/{project} with a valid _id', done => {
            chai.request(server)
                .delete('/issue-tracker/api/issues/test')
                .send({_id: testIssueID})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.result, 'successfully deleted');
                    assert.equal(res.body._id, testIssueID);
                    done();
                });
        });
        // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
        test('Test DELETE /api/issues/{project} with an invalid _id', done => {
            chai.request(server)
                .delete('/issue-tracker/api/issues/test')
                .send({_id: 'heyooo'})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'could not delete');
                    assert.equal(res.body._id, 'heyooo');
                    done();
                });
        });
        // Delete an issue with missing _id: DELETE request to /api/issues/{project}
        test('Test DELETE /api/issues/{project} with missing _id', done => {
            chai.request(server)
                .delete('/issue-tracker/api/issues/test')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'missing _id');
                    done();
                });
        });
    });
});
