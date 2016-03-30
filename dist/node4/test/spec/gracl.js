'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _chai = require('chai');

var _index = require('../classes/index');

var classes = _interopRequireWildcard(_index);

var _index2 = require('../helpers/index');

var helpers = _interopRequireWildcard(_index2);

var _index3 = require('../../lib/index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
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

const permissionKey = 'graclPermissions';
const graph = new _index3.Graph({
    resources: [{ permissionProperty: permissionKey, name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel }, { permissionProperty: permissionKey, name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel }, { permissionProperty: permissionKey, name: 'Organization', repository: classes.orgModel }],
    subjects: [{ permissionProperty: permissionKey, name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel }, { permissionProperty: permissionKey, name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel }, { permissionProperty: permissionKey, name: 'Organization', repository: classes.orgModel }]
});
const graphClasses = {
    PostResource: graph.getResource('Post'),
    BlogResource: graph.getResource('Blog'),
    UserSubject: graph.getSubject('User'),
    TeamSubject: graph.getSubject('Team'),
    OrganizationResource: graph.getResource('Organization'),
    OrganizationSubject: graph.getSubject('Organization')
};
describe('gracl', () => {
    let orgA, orgB, teamA1, teamA2, teamA3, teamB1, userA1, userA2, userB1, blogA1, blogB1, postB1a, postB1b, postA1a;
    const resetTestData = () => __awaiter(undefined, void 0, void 0, function* () {
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
        yield Promise.all([classes.orgModel.saveEntity(orgA.id, orgA), classes.orgModel.saveEntity(orgB.id, orgB), classes.teamModel.saveEntity(teamA1.id, teamA1), classes.teamModel.saveEntity(teamA2.id, teamA2), classes.teamModel.saveEntity(teamA3.id, teamA3), classes.teamModel.saveEntity(teamB1.id, teamB1), classes.userModel.saveEntity(userA1.id, userA1), classes.userModel.saveEntity(userA2.id, userA2), classes.userModel.saveEntity(userB1.id, userB1), classes.blogModel.saveEntity(blogA1.id, blogA1), classes.blogModel.saveEntity(blogB1.id, blogB1), classes.postModel.saveEntity(postA1a.id, postA1a), classes.postModel.saveEntity(postB1a.id, postB1a), classes.postModel.saveEntity(postB1b.id, postB1b)]);
    });
    describe('- Class tests', () => {
        beforeEach(resetTestData);
        it('Creating a node subclass without a repository should throw on instantiation', () => {
            class TestResource extends _index3.Resource {}
            ;
            class TestSubject extends _index3.Subject {}
            ;
            (0, _chai.expect)(() => new TestResource({}), 'Instantiate Resource').to.throw();
            (0, _chai.expect)(() => new TestResource({}), 'Instantiate Subject').to.throw();
        });
        it('Should use displayName if provided in Node.toString()', () => {
            class TestResource extends _index3.Resource {}
            TestResource.displayName = 'MY_RESOURCE';
            TestResource.repository = new _index3.MemoryRepository();
            const node = new TestResource({ id: 1 });
            (0, _chai.expect)(node.getName()).to.equal(TestResource.displayName);
            (0, _chai.expect)(node.toString()).to.equal(`<Resource:${ TestResource.displayName } id=1>`);
        });
        it('Retrieving document from repository should work', () => __awaiter(undefined, void 0, void 0, function* () {
            (0, _chai.expect)((yield classes.orgModel.getEntity(orgA.id)), 'Memory Repository should sucessfully set items').to.equal(orgA);
        }));
    });
    describe('- Graph specific tests', () => {
        beforeEach(resetTestData);
        it('Graph classes should have proper inheritance chain', () => {
            const PostResource = graphClasses.PostResource;
            const BlogResource = graphClasses.BlogResource;
            const UserSubject = graphClasses.UserSubject;
            const TeamSubject = graphClasses.TeamSubject;
            const OrganizationResource = graphClasses.OrganizationResource;
            const OrganizationSubject = graphClasses.OrganizationSubject;

            const PostResourceInstance = new PostResource({ id: 1 });
            const BlogResourceInstance = new BlogResource({ id: 1 });
            const UserSubjectInstance = new UserSubject({ id: 1 });
            const TeamSubjectInstance = new TeamSubject({ id: 1 });
            const OrganizationResourceInstance = new OrganizationResource({ id: 1 });
            const OrganizationSubjectInstance = new OrganizationSubject({ id: 1 });
            (0, _chai.expect)(PostResourceInstance, 'Post -> Blog').to.be.instanceof(BlogResource);
            (0, _chai.expect)(PostResourceInstance, 'Post -> Org').to.be.instanceof(OrganizationResource);
            (0, _chai.expect)(UserSubjectInstance, 'User -> Team').to.be.instanceof(TeamSubject);
            (0, _chai.expect)(UserSubjectInstance, 'User -> Org').to.be.instanceof(OrganizationSubject);
        });
        it('Graph should throw if there is an undefined parent', () => {
            const createGraph = () => new _index3.Graph({
                resources: [{ name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel }, { name: 'Organization', repository: classes.orgModel }],
                subjects: [{ name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel }, { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel }, { name: 'Organization', repository: classes.orgModel }]
            });
            (0, _chai.expect)(createGraph).to.throw();
        });
        it('Graph should throw if there is a circular dependency', () => {
            const createGraph = () => new _index3.Graph({
                resources: [{ name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel }, { name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel }, { name: 'Organization', parent: 'Post', repository: classes.orgModel }],
                subjects: [{ name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel }, { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel }, { name: 'Organization', repository: classes.orgModel }]
            });
            (0, _chai.expect)(createGraph).to.throw();
        });
    });
    describe('- Node permission tests', () => {
        beforeEach(resetTestData);
        const testCases = [{
            description: 'user instantiated classes',
            classes: classes
        }, {
            description: 'classes created by graph',
            classes: graphClasses
        }];
        testCases.forEach(test => {
            describe('- Permissions tests using ' + test.description, () => {
                runNodeTestsWithClasses(test.classes);
            });
        });
        function runNodeTestsWithClasses(nodeClasses) {
            it('Resource.getParents() should return Resource instances of parent objects', () => __awaiter(this, void 0, void 0, function* () {
                const resource = new nodeClasses.PostResource(postA1a);

                var _ref = yield resource.getParents();

                var _ref2 = _slicedToArray(_ref, 1);

                const parent = _ref2[0];

                (0, _chai.expect)(parent, 'Returned parent should be gracl node instance.').to.be.instanceof(nodeClasses.BlogResource);
                (0, _chai.expect)(parent.getId(), 'Correct parent should be returned.').to.equal(blogA1.id);
            }));
            it('Resource.allow(Subject, <perm>) -> subject can access resource.', () => __awaiter(this, void 0, void 0, function* () {
                const resource = new nodeClasses.PostResource(postA1a),
                      subject = new nodeClasses.UserSubject(userA1);
                const initialAllowed = yield resource.isAllowed(subject, 'view');
                (0, _chai.expect)((yield resource.allow(subject, 'view')), 'Setting permission should return same resource type.').to.be.instanceof(nodeClasses.PostResource);
                const afterSetAllowed = yield resource.isAllowed(subject, 'view');
                (0, _chai.expect)(initialAllowed, 'the subject should not yet be allowed to view the resource.').to.equal(false);
                (0, _chai.expect)(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
            }));
            it('Resource.allow(Subject, <perm>) -> resource should have permission with subjectType and resourceType set.', () => __awaiter(this, void 0, void 0, function* () {
                const resource = new nodeClasses.PostResource(postA1a),
                      subject = new nodeClasses.UserSubject(userA1);
                yield resource.allow(subject, 'view');

                var _resource$doc$permiss = _slicedToArray(resource.doc[permissionKey], 1);

                const permission = _resource$doc$permiss[0];

                (0, _chai.expect)(permission.resourceType).to.equal(resource.getName());
                (0, _chai.expect)(permission.subjectType).to.equal(subject.getName());
            }));
            it('Resource.allow(parentSubject, <perm>) -> child subject can access resource.', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1),
                      childResource = new nodeClasses.PostResource(postA1a),
                      subject = new nodeClasses.UserSubject(userA1);
                const initialAllowed = yield childResource.isAllowed(subject, 'view');
                (0, _chai.expect)((yield parentResource.allow(subject, 'view')), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(nodeClasses.BlogResource);
                const afterSetAllowed = yield childResource.isAllowed(subject, 'view');
                (0, _chai.expect)(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
                (0, _chai.expect)(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
            }));
            it('parentResource.allow(parentSubject, <perm>) -> child subject can access child resource.', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1),
                      childResource = new nodeClasses.PostResource(postA1a),
                      parentSubject = new nodeClasses.TeamSubject(teamA1),
                      childSubject = new nodeClasses.UserSubject(userA1);
                const initialAllowed = yield childResource.isAllowed(childSubject, 'view');
                (0, _chai.expect)((yield parentResource.allow(parentSubject, 'view')), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(nodeClasses.BlogResource);
                const afterSetAllowed = yield childResource.isAllowed(childSubject, 'view');
                (0, _chai.expect)(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
                (0, _chai.expect)(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
            }));
            it('Permissions should be visible through resource.getPermissionsHierarchy()', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1),
                      childResource = new nodeClasses.PostResource(postA1a),
                      subject = new nodeClasses.UserSubject(userA1);
                yield parentResource.allow(subject, 'view');
                const hiearchy = yield childResource.getPermissionsHierarchy();
                (0, _chai.expect)(hiearchy.node, 'Node should be string representation.').to.equal(childResource.toString());
                (0, _chai.expect)(hiearchy.parents[0].permissions, 'Parent resource should have one permission.').to.have.length(1);
                (0, _chai.expect)(hiearchy.parents[0].permissions[0].access['view'], 'View access should be true').to.equal(true);
            }));
            it('Lowest node on hierarchy wins conflicts (deny post for team)', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1),
                      childResource = new nodeClasses.PostResource(postA1a),
                      parentSubject = new nodeClasses.TeamSubject(teamA1),
                      childSubject = new nodeClasses.UserSubject(userA1);
                (0, _chai.expect)((yield childResource.isAllowed(childSubject, 'view')), 'User should not have access to post before permission set.').to.equal(false);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                (0, _chai.expect)((yield parentResource.isAllowed(parentSubject, 'view')), 'Team should have access to blog after permission set').to.equal(true);
                (0, _chai.expect)((yield childResource.isAllowed(parentSubject, 'view')), 'Team should not have access to post after permission set.').to.equal(false);
                (0, _chai.expect)((yield parentResource.isAllowed(childSubject, 'view')), 'User should have access to blog after permission set').to.equal(true);
                (0, _chai.expect)((yield childResource.isAllowed(childSubject, 'view')), 'User should not have access to post after permission set.').to.equal(false);
            }));
            it('Explicit false set for permission should win over true set somewhere else in hierarchy (resource)', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1),
                      childResource = new nodeClasses.PostResource(postA1a),
                      subject = new nodeClasses.UserSubject(userA1);
                yield childResource.allow(subject, 'view');
                const preDenyAccess = yield childResource.isAllowed(subject, 'view');
                yield parentResource.deny(subject, 'view');
                const postDenyAccess = yield childResource.isAllowed(subject, 'view');
                (0, _chai.expect)(preDenyAccess, 'before denying parent, should have access').to.equal(true);
                (0, _chai.expect)(postDenyAccess, 'after denying parent, should have access').to.equal(false);
            }));
            it('Explicit false set for permission should win over true set somewhere else in hierarchy (subject)', () => __awaiter(this, void 0, void 0, function* () {
                const resource = new nodeClasses.BlogResource(blogA1),
                      parentSubject = new nodeClasses.TeamSubject(teamA1),
                      childSubject = new nodeClasses.UserSubject(userA1);
                yield resource.allow(childSubject, 'view');
                const preDenyAccess = yield resource.isAllowed(childSubject, 'view');
                yield resource.deny(parentSubject, 'view');
                const postDenyAccess = yield resource.isAllowed(childSubject, 'view');
                (0, _chai.expect)(preDenyAccess, 'before denying parent, should have access').to.equal(true);
                (0, _chai.expect)(postDenyAccess, 'after denying parent, should have access').to.equal(false);
            }));
            it('Permission explainations should be accurate', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1),
                      childResource = new nodeClasses.PostResource(postA1a),
                      parentSubject = new nodeClasses.TeamSubject(teamA1),
                      childSubject = new nodeClasses.UserSubject(userA1);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                const reason = `Permission set on <Resource:${ childResource.getName() } id=p0014> for <Subject:${ parentSubject.getName() } id=t003> = false`;
                (0, _chai.expect)((yield childResource.explainPermission(childSubject, 'view')), 'Explaining why child subject cannot access child resource').to.equal(reason);
            }));
            it('Subject method results should equal resource method results', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1),
                      childResource = new nodeClasses.PostResource(postA1a),
                      parentSubject = new nodeClasses.TeamSubject(teamA1),
                      childSubject = new nodeClasses.UserSubject(userA1);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                (0, _chai.expect)((yield parentResource.isAllowed(parentSubject, 'view')), 'Team should have access to blog after permission set').to.equal((yield parentSubject.isAllowed(parentResource, 'view')));
                (0, _chai.expect)((yield childResource.isAllowed(parentSubject, 'view')), 'Team should not have access to post after permission set.').to.equal((yield parentSubject.isAllowed(childResource, 'view')));
                (0, _chai.expect)((yield parentResource.isAllowed(childSubject, 'view')), 'User should have access to blog after permission set').to.equal((yield childSubject.isAllowed(parentResource, 'view')));
                (0, _chai.expect)((yield childResource.isAllowed(childSubject, 'view')), 'User should have access to post after permission set.').to.equal((yield childSubject.isAllowed(childResource, 'view')));
            }));
            it('Node.getHierarchyIds() should return flattened array of correct ids', () => __awaiter(this, void 0, void 0, function* () {
                const childResource = new nodeClasses.PostResource(postA1a);
                (0, _chai.expect)((yield childResource.getHierarchyIds()), 'Post -> Blog -> Org').to.deep.equal(['p0014', 'b0010', 'o001']);
            }));
            it('Node.getHierarchyClassNames() should return array of class names', () => {
                const childResource = new nodeClasses.PostResource(postA1a),
                      childSubject = new nodeClasses.UserSubject(userA1);
                const name = c => c.displayName || c.name;
                (0, _chai.expect)(childResource.getHierarchyClassNames(), 'resource class names').to.deep.equal([name(nodeClasses.PostResource), name(nodeClasses.BlogResource), name(nodeClasses.OrganizationResource)]);
                (0, _chai.expect)(childSubject.getHierarchyClassNames(), 'subject class names').to.deep.equal([name(nodeClasses.UserSubject), name(nodeClasses.TeamSubject), name(nodeClasses.OrganizationSubject)]);
            });
        }
    });
});