"use strict";

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var chai_1 = require('chai');
var classes = require('../classes/index');
var helpers = require('../helpers/index');
var index_1 = require('../../lib/index');
var graph = new index_1.Graph({
    resources: [{ name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel }, { name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel }, { name: 'Organization', repository: classes.orgModel }],
    subjects: [{ name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel }, { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel }, { name: 'Organization', repository: classes.orgModel }]
});
var graphClasses = {
    PostResource: graph.getResource('Post'),
    BlogResource: graph.getResource('Blog'),
    UserSubject: graph.getSubject('User'),
    TeamSubject: graph.getSubject('Team'),
    OrganizationResource: graph.getResource('Organization'),
    OrganizationSubject: graph.getSubject('Organization')
};
describe('gracl', function () {
    var orgA = undefined,
        orgB = undefined,
        teamA1 = undefined,
        teamA2 = undefined,
        teamA3 = undefined,
        teamB1 = undefined,
        userA1 = undefined,
        userA2 = undefined,
        userB1 = undefined,
        blogA1 = undefined,
        blogB1 = undefined,
        postB1a = undefined,
        postB1b = undefined,
        postA1a = undefined;
    var resetTestData = function resetTestData() {
        return __awaiter(undefined, void 0, void 0, _regenerator2.default.mark(function _callee() {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            helpers.uidReset();
                            orgA = helpers.org();
                            orgB = helpers.org();
                            teamA1 = helpers.team(orgB);
                            teamA2 = helpers.team(orgB);
                            teamA3 = helpers.team(orgB);
                            teamB1 = helpers.team(orgB);
                            userA1 = helpers.user([teamA1, teamA2]);
                            userA2 = helpers.user([teamA1, teamA3]);
                            userB1 = helpers.user([teamB1]);
                            blogA1 = helpers.blog(orgA);
                            blogB1 = helpers.blog(orgB);
                            postB1a = helpers.post(blogB1);
                            postB1b = helpers.post(blogB1);
                            postA1a = helpers.post(blogA1);
                            _context.next = 17;
                            return _promise2.default.all([classes.orgModel.saveEntity(orgA.id, orgA), classes.orgModel.saveEntity(orgB.id, orgB), classes.teamModel.saveEntity(teamA1.id, teamA1), classes.teamModel.saveEntity(teamA2.id, teamA2), classes.teamModel.saveEntity(teamA3.id, teamA3), classes.teamModel.saveEntity(teamB1.id, teamB1), classes.userModel.saveEntity(userA1.id, userA1), classes.userModel.saveEntity(userA2.id, userA2), classes.userModel.saveEntity(userB1.id, userB1), classes.blogModel.saveEntity(blogA1.id, blogA1), classes.blogModel.saveEntity(blogB1.id, blogB1), classes.postModel.saveEntity(postA1a.id, postA1a), classes.postModel.saveEntity(postB1a.id, postB1a), classes.postModel.saveEntity(postB1b.id, postB1b)]);

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    };
    describe('- Class tests', function () {
        beforeEach(resetTestData);
        it('Creating a node subclass without a repository should throw on instantiation', function () {
            var TestResource = function (_index_1$Resource) {
                (0, _inherits3.default)(TestResource, _index_1$Resource);

                function TestResource() {
                    (0, _classCallCheck3.default)(this, TestResource);
                    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TestResource).apply(this, arguments));
                }

                return TestResource;
            }(index_1.Resource);

            ;

            var TestSubject = function (_index_1$Subject) {
                (0, _inherits3.default)(TestSubject, _index_1$Subject);

                function TestSubject() {
                    (0, _classCallCheck3.default)(this, TestSubject);
                    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TestSubject).apply(this, arguments));
                }

                return TestSubject;
            }(index_1.Subject);

            ;
            chai_1.expect(function () {
                return new TestResource({});
            }, 'Instantiate Resource').to.throw();
            chai_1.expect(function () {
                return new TestResource({});
            }, 'Instantiate Subject').to.throw();
        });
        it('Should use displayName if provided in Node.toString()', function () {
            var TestResource = function (_index_1$Resource2) {
                (0, _inherits3.default)(TestResource, _index_1$Resource2);

                function TestResource() {
                    (0, _classCallCheck3.default)(this, TestResource);
                    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TestResource).apply(this, arguments));
                }

                return TestResource;
            }(index_1.Resource);

            TestResource.displayName = 'MY_RESOURCE';
            TestResource.repository = new index_1.MemoryRepository();
            var node = new TestResource({ id: 1 });
            chai_1.expect(node.getName()).to.equal(TestResource.displayName);
            chai_1.expect(node.toString()).to.equal('<Resource:' + TestResource.displayName + ' id=1>');
        });
        it('Retrieving document from repository should work', function () {
            return __awaiter(undefined, void 0, void 0, _regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.t0 = chai_1;
                                _context2.next = 3;
                                return classes.orgModel.getEntity(orgA.id);

                            case 3:
                                _context2.t1 = _context2.sent;
                                _context2.t2 = orgA;

                                _context2.t0.expect.call(_context2.t0, _context2.t1, 'Memory Repository should sucessfully set items').to.equal(_context2.t2);

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        });
    });
    describe('- Graph specific tests', function () {
        beforeEach(resetTestData);
        it('Graph classes should have proper inheritance chain', function () {
            var PostResource = graphClasses.PostResource;
            var BlogResource = graphClasses.BlogResource;
            var UserSubject = graphClasses.UserSubject;
            var TeamSubject = graphClasses.TeamSubject;
            var OrganizationResource = graphClasses.OrganizationResource;
            var OrganizationSubject = graphClasses.OrganizationSubject;

            var PostResourceInstance = new PostResource({ id: 1 });
            var BlogResourceInstance = new BlogResource({ id: 1 });
            var UserSubjectInstance = new UserSubject({ id: 1 });
            var TeamSubjectInstance = new TeamSubject({ id: 1 });
            var OrganizationResourceInstance = new OrganizationResource({ id: 1 });
            var OrganizationSubjectInstance = new OrganizationSubject({ id: 1 });
            chai_1.expect(PostResourceInstance, 'Post -> Blog').to.be.instanceof(BlogResource);
            chai_1.expect(PostResourceInstance, 'Post -> Org').to.be.instanceof(OrganizationResource);
            chai_1.expect(UserSubjectInstance, 'User -> Team').to.be.instanceof(TeamSubject);
            chai_1.expect(UserSubjectInstance, 'User -> Org').to.be.instanceof(OrganizationSubject);
        });
        it('Graph should throw if there is an undefined parent', function () {
            var createGraph = function createGraph() {
                return new index_1.Graph({
                    resources: [{ name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel }, { name: 'Organization', repository: classes.orgModel }],
                    subjects: [{ name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel }, { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel }, { name: 'Organization', repository: classes.orgModel }]
                });
            };
            chai_1.expect(createGraph).to.throw();
        });
        it('Graph should throw if there is a circular dependency', function () {
            var createGraph = function createGraph() {
                return new index_1.Graph({
                    resources: [{ name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel }, { name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel }, { name: 'Organization', parent: 'Post', repository: classes.orgModel }],
                    subjects: [{ name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel }, { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel }, { name: 'Organization', repository: classes.orgModel }]
                });
            };
            chai_1.expect(createGraph).to.throw();
        });
    });
    describe('- Node permission tests', function () {
        beforeEach(resetTestData);
        var testCases = [{
            description: 'user instantiated classes',
            classes: classes
        }, {
            description: 'classes created by graph',
            classes: graphClasses
        }];
        testCases.forEach(function (test) {
            describe('- Permissions tests using ' + test.description, function () {
                runNodeTestsWithClasses(test.classes);
            });
        });
        function runNodeTestsWithClasses(nodeClasses) {
            var _this4 = this;

            it('Resource.getParents() should return Resource instances of parent objects', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee3() {
                    var resource, _ref, _ref2, parent;

                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    resource = new nodeClasses.PostResource(postA1a);
                                    _context3.next = 3;
                                    return resource.getParents();

                                case 3:
                                    _ref = _context3.sent;
                                    _ref2 = (0, _slicedToArray3.default)(_ref, 1);
                                    parent = _ref2[0];

                                    chai_1.expect(parent, 'Returned parent should be gracl node instance.').to.be.instanceof(nodeClasses.BlogResource);
                                    chai_1.expect(parent.getId(), 'Correct parent should be returned.').to.equal(blogA1.id);

                                case 8:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this);
                }));
            });
            it('Resource.allow(Subject, <perm>) -> subject can access resource.', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee4() {
                    var resource, subject, initialAllowed, afterSetAllowed;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    resource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                                    _context4.next = 3;
                                    return resource.isAllowed(subject, 'view');

                                case 3:
                                    initialAllowed = _context4.sent;
                                    _context4.t0 = chai_1;
                                    _context4.next = 7;
                                    return resource.allow(subject, 'view');

                                case 7:
                                    _context4.t1 = _context4.sent;
                                    _context4.t2 = nodeClasses.PostResource;

                                    _context4.t0.expect.call(_context4.t0, _context4.t1, 'Setting permission should return same resource type.').to.be.instanceof(_context4.t2);

                                    _context4.next = 12;
                                    return resource.isAllowed(subject, 'view');

                                case 12:
                                    afterSetAllowed = _context4.sent;

                                    chai_1.expect(initialAllowed, 'the subject should not yet be allowed to view the resource.').to.equal(false);
                                    chai_1.expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);

                                case 15:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this);
                }));
            });
            it('Resource.allow(Subject, <perm>) -> resource should have permission with subjectType and resourceType set.', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee5() {
                    var resource, subject, _resource$doc$permiss, permission;

                    return _regenerator2.default.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    resource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                                    _context5.next = 3;
                                    return resource.allow(subject, 'view');

                                case 3:
                                    _resource$doc$permiss = (0, _slicedToArray3.default)(resource.doc.permissions, 1);
                                    permission = _resource$doc$permiss[0];

                                    chai_1.expect(permission.resourceType).to.equal(resource.getName());
                                    chai_1.expect(permission.subjectType).to.equal(subject.getName());

                                case 7:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, this);
                }));
            });
            it('Resource.allow(parentSubject, <perm>) -> child subject can access resource.', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee6() {
                    var parentResource, childResource, subject, initialAllowed, afterSetAllowed;
                    return _regenerator2.default.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                                    _context6.next = 3;
                                    return childResource.isAllowed(subject, 'view');

                                case 3:
                                    initialAllowed = _context6.sent;
                                    _context6.t0 = chai_1;
                                    _context6.next = 7;
                                    return parentResource.allow(subject, 'view');

                                case 7:
                                    _context6.t1 = _context6.sent;
                                    _context6.t2 = nodeClasses.BlogResource;

                                    _context6.t0.expect.call(_context6.t0, _context6.t1, 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(_context6.t2);

                                    _context6.next = 12;
                                    return childResource.isAllowed(subject, 'view');

                                case 12:
                                    afterSetAllowed = _context6.sent;

                                    chai_1.expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
                                    chai_1.expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);

                                case 15:
                                case 'end':
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, this);
                }));
            });
            it('parentResource.allow(parentSubject, <perm>) -> child subject can access child resource.', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee7() {
                    var parentResource, childResource, parentSubject, childSubject, initialAllowed, afterSetAllowed;
                    return _regenerator2.default.wrap(function _callee7$(_context7) {
                        while (1) {
                            switch (_context7.prev = _context7.next) {
                                case 0:
                                    parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                                    _context7.next = 3;
                                    return childResource.isAllowed(childSubject, 'view');

                                case 3:
                                    initialAllowed = _context7.sent;
                                    _context7.t0 = chai_1;
                                    _context7.next = 7;
                                    return parentResource.allow(parentSubject, 'view');

                                case 7:
                                    _context7.t1 = _context7.sent;
                                    _context7.t2 = nodeClasses.BlogResource;

                                    _context7.t0.expect.call(_context7.t0, _context7.t1, 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(_context7.t2);

                                    _context7.next = 12;
                                    return childResource.isAllowed(childSubject, 'view');

                                case 12:
                                    afterSetAllowed = _context7.sent;

                                    chai_1.expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
                                    chai_1.expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);

                                case 15:
                                case 'end':
                                    return _context7.stop();
                            }
                        }
                    }, _callee7, this);
                }));
            });
            it('Permissions should be visible through resource.getPermissionsHierarchy()', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee8() {
                    var parentResource, childResource, subject, hiearchy;
                    return _regenerator2.default.wrap(function _callee8$(_context8) {
                        while (1) {
                            switch (_context8.prev = _context8.next) {
                                case 0:
                                    parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                                    _context8.next = 3;
                                    return parentResource.allow(subject, 'view');

                                case 3:
                                    _context8.next = 5;
                                    return childResource.getPermissionsHierarchy();

                                case 5:
                                    hiearchy = _context8.sent;

                                    chai_1.expect(hiearchy.node, 'Node should be string representation.').to.equal(childResource.toString());
                                    chai_1.expect(hiearchy.parents[0].permissions, 'Parent resource should have one permission.').to.have.length(1);
                                    chai_1.expect(hiearchy.parents[0].permissions[0].access['view'], 'View access should be true').to.equal(true);

                                case 9:
                                case 'end':
                                    return _context8.stop();
                            }
                        }
                    }, _callee8, this);
                }));
            });
            it('Lowest node on hierarchy wins conflicts (deny post for team)', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee9() {
                    var parentResource, childResource, parentSubject, childSubject;
                    return _regenerator2.default.wrap(function _callee9$(_context9) {
                        while (1) {
                            switch (_context9.prev = _context9.next) {
                                case 0:
                                    parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                                    _context9.t0 = chai_1;
                                    _context9.next = 4;
                                    return childResource.isAllowed(childSubject, 'view');

                                case 4:
                                    _context9.t1 = _context9.sent;

                                    _context9.t0.expect.call(_context9.t0, _context9.t1, 'User should not have access to post before permission set.').to.equal(false);

                                    _context9.next = 8;
                                    return parentResource.allow(parentSubject, 'view');

                                case 8:
                                    _context9.next = 10;
                                    return childResource.deny(parentSubject, 'view');

                                case 10:
                                    _context9.t2 = chai_1;
                                    _context9.next = 13;
                                    return parentResource.isAllowed(parentSubject, 'view');

                                case 13:
                                    _context9.t3 = _context9.sent;

                                    _context9.t2.expect.call(_context9.t2, _context9.t3, 'Team should have access to blog after permission set').to.equal(true);

                                    _context9.t4 = chai_1;
                                    _context9.next = 18;
                                    return childResource.isAllowed(parentSubject, 'view');

                                case 18:
                                    _context9.t5 = _context9.sent;

                                    _context9.t4.expect.call(_context9.t4, _context9.t5, 'Team should not have access to post after permission set.').to.equal(false);

                                    _context9.t6 = chai_1;
                                    _context9.next = 23;
                                    return parentResource.isAllowed(childSubject, 'view');

                                case 23:
                                    _context9.t7 = _context9.sent;

                                    _context9.t6.expect.call(_context9.t6, _context9.t7, 'User should have access to blog after permission set').to.equal(true);

                                    _context9.t8 = chai_1;
                                    _context9.next = 28;
                                    return childResource.isAllowed(childSubject, 'view');

                                case 28:
                                    _context9.t9 = _context9.sent;

                                    _context9.t8.expect.call(_context9.t8, _context9.t9, 'User should not have access to post after permission set.').to.equal(false);

                                case 30:
                                case 'end':
                                    return _context9.stop();
                            }
                        }
                    }, _callee9, this);
                }));
            });
            it('Lowest node on hierarchy wins conflicts (deny post for team, but allow for user)', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee10() {
                    var parentResource, childResource, parentSubject, childSubject;
                    return _regenerator2.default.wrap(function _callee10$(_context10) {
                        while (1) {
                            switch (_context10.prev = _context10.next) {
                                case 0:
                                    parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                                    _context10.t0 = chai_1;
                                    _context10.next = 4;
                                    return childResource.isAllowed(childSubject, 'view');

                                case 4:
                                    _context10.t1 = _context10.sent;

                                    _context10.t0.expect.call(_context10.t0, _context10.t1, 'User should not have access to post before permission set.').to.equal(false);

                                    _context10.next = 8;
                                    return parentResource.allow(parentSubject, 'view');

                                case 8:
                                    _context10.next = 10;
                                    return childResource.deny(parentSubject, 'view');

                                case 10:
                                    _context10.next = 12;
                                    return childResource.allow(childSubject, 'view');

                                case 12:
                                    _context10.next = 14;
                                    return parentResource.deny(childSubject, 'view');

                                case 14:
                                    _context10.t2 = chai_1;
                                    _context10.next = 17;
                                    return parentResource.isAllowed(parentSubject, 'view');

                                case 17:
                                    _context10.t3 = _context10.sent;

                                    _context10.t2.expect.call(_context10.t2, _context10.t3, 'Team should have access to blog after permission set').to.equal(true);

                                    _context10.t4 = chai_1;
                                    _context10.next = 22;
                                    return childResource.isAllowed(parentSubject, 'view');

                                case 22:
                                    _context10.t5 = _context10.sent;

                                    _context10.t4.expect.call(_context10.t4, _context10.t5, 'Team should not have access to post after permission set.').to.equal(false);

                                    _context10.t6 = chai_1;
                                    _context10.next = 27;
                                    return parentResource.isAllowed(childSubject, 'view');

                                case 27:
                                    _context10.t7 = _context10.sent;

                                    _context10.t6.expect.call(_context10.t6, _context10.t7, 'User should have access to blog after permission set').to.equal(false);

                                    _context10.t8 = chai_1;
                                    _context10.next = 32;
                                    return childResource.isAllowed(childSubject, 'view');

                                case 32:
                                    _context10.t9 = _context10.sent;

                                    _context10.t8.expect.call(_context10.t8, _context10.t9, 'User should have access to post after permission set.').to.equal(true);

                                case 34:
                                case 'end':
                                    return _context10.stop();
                            }
                        }
                    }, _callee10, this);
                }));
            });
            it('Permission explainations should be accurate', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee11() {
                    var parentResource, childResource, parentSubject, childSubject, reason;
                    return _regenerator2.default.wrap(function _callee11$(_context11) {
                        while (1) {
                            switch (_context11.prev = _context11.next) {
                                case 0:
                                    parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                                    _context11.next = 3;
                                    return parentResource.allow(parentSubject, 'view');

                                case 3:
                                    _context11.next = 5;
                                    return childResource.deny(parentSubject, 'view');

                                case 5:
                                    reason = 'Permission set on <Resource:' + childResource.getName() + ' id=p0014> for <Subject:' + parentSubject.getName() + ' id=t003> = false';
                                    _context11.t0 = chai_1;
                                    _context11.next = 9;
                                    return childResource.explainPermission(childSubject, 'view');

                                case 9:
                                    _context11.t1 = _context11.sent;
                                    _context11.t2 = reason;

                                    _context11.t0.expect.call(_context11.t0, _context11.t1, 'Explaining why child subject cannot access child resource').to.equal(_context11.t2);

                                case 12:
                                case 'end':
                                    return _context11.stop();
                            }
                        }
                    }, _callee11, this);
                }));
            });
            it('Subject method results should equal resource method results', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee12() {
                    var parentResource, childResource, parentSubject, childSubject;
                    return _regenerator2.default.wrap(function _callee12$(_context12) {
                        while (1) {
                            switch (_context12.prev = _context12.next) {
                                case 0:
                                    parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                                    _context12.next = 3;
                                    return parentResource.allow(parentSubject, 'view');

                                case 3:
                                    _context12.next = 5;
                                    return childResource.deny(parentSubject, 'view');

                                case 5:
                                    _context12.t1 = chai_1;
                                    _context12.next = 8;
                                    return parentResource.isAllowed(parentSubject, 'view');

                                case 8:
                                    _context12.t2 = _context12.sent;
                                    _context12.t0 = _context12.t1.expect.call(_context12.t1, _context12.t2, 'Team should have access to blog after permission set').to;
                                    _context12.next = 12;
                                    return parentSubject.isAllowed(parentResource, 'view');

                                case 12:
                                    _context12.t3 = _context12.sent;

                                    _context12.t0.equal.call(_context12.t0, _context12.t3);

                                    _context12.t5 = chai_1;
                                    _context12.next = 17;
                                    return childResource.isAllowed(parentSubject, 'view');

                                case 17:
                                    _context12.t6 = _context12.sent;
                                    _context12.t4 = _context12.t5.expect.call(_context12.t5, _context12.t6, 'Team should not have access to post after permission set.').to;
                                    _context12.next = 21;
                                    return parentSubject.isAllowed(childResource, 'view');

                                case 21:
                                    _context12.t7 = _context12.sent;

                                    _context12.t4.equal.call(_context12.t4, _context12.t7);

                                    _context12.t9 = chai_1;
                                    _context12.next = 26;
                                    return parentResource.isAllowed(childSubject, 'view');

                                case 26:
                                    _context12.t10 = _context12.sent;
                                    _context12.t8 = _context12.t9.expect.call(_context12.t9, _context12.t10, 'User should have access to blog after permission set').to;
                                    _context12.next = 30;
                                    return childSubject.isAllowed(parentResource, 'view');

                                case 30:
                                    _context12.t11 = _context12.sent;

                                    _context12.t8.equal.call(_context12.t8, _context12.t11);

                                    _context12.t13 = chai_1;
                                    _context12.next = 35;
                                    return childResource.isAllowed(childSubject, 'view');

                                case 35:
                                    _context12.t14 = _context12.sent;
                                    _context12.t12 = _context12.t13.expect.call(_context12.t13, _context12.t14, 'User should have access to post after permission set.').to;
                                    _context12.next = 39;
                                    return childSubject.isAllowed(childResource, 'view');

                                case 39:
                                    _context12.t15 = _context12.sent;

                                    _context12.t12.equal.call(_context12.t12, _context12.t15);

                                case 41:
                                case 'end':
                                    return _context12.stop();
                            }
                        }
                    }, _callee12, this);
                }));
            });
            it('Node.getHierarchyIds() should return flattened array of correct ids', function () {
                return __awaiter(_this4, void 0, void 0, _regenerator2.default.mark(function _callee13() {
                    var childResource;
                    return _regenerator2.default.wrap(function _callee13$(_context13) {
                        while (1) {
                            switch (_context13.prev = _context13.next) {
                                case 0:
                                    childResource = new nodeClasses.PostResource(postA1a);
                                    _context13.t0 = chai_1;
                                    _context13.next = 4;
                                    return childResource.getHierarchyIds();

                                case 4:
                                    _context13.t1 = _context13.sent;
                                    _context13.t2 = ['p0014', 'b0010', 'o001'];

                                    _context13.t0.expect.call(_context13.t0, _context13.t1, 'Post -> Blog -> Org').to.deep.equal(_context13.t2);

                                case 7:
                                case 'end':
                                    return _context13.stop();
                            }
                        }
                    }, _callee13, this);
                }));
            });
            it('Node.getHierarchyClassNames() should return array of class names', function () {
                var childResource = new nodeClasses.PostResource(postA1a),
                    childSubject = new nodeClasses.UserSubject(userA1);
                var name = function name(c) {
                    return c.displayName || c.name;
                };
                chai_1.expect(childResource.getHierarchyClassNames(), 'resource class names').to.deep.equal([name(nodeClasses.PostResource), name(nodeClasses.BlogResource), name(nodeClasses.OrganizationResource)]);
                chai_1.expect(childSubject.getHierarchyClassNames(), 'subject class names').to.deep.equal([name(nodeClasses.UserSubject), name(nodeClasses.TeamSubject), name(nodeClasses.OrganizationSubject)]);
            });
        }
    });
});