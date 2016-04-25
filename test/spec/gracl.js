"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var chai_1 = require('chai');
var _ = require('lodash');
var classes = require('../classes/index');
var helpers = require('../helpers/index');
var util = require('../../lib/util');
var gracl_1 = require('../../lib/gracl');
var ava_1 = require('ava');
var permissionKey = 'graclPermissions';
var graph = new gracl_1.Graph({
    resources: [
        { permissionProperty: permissionKey, name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel },
        { permissionProperty: permissionKey, name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel },
        { permissionProperty: permissionKey, name: 'Organization', repository: classes.orgModel }
    ],
    subjects: [
        { permissionProperty: permissionKey, name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel },
        { permissionProperty: permissionKey, name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel },
        { permissionProperty: permissionKey, name: 'Organization', repository: classes.orgModel }
    ]
});
var graphClasses = {
    PostResource: graph.getResource('Post'),
    BlogResource: graph.getResource('Blog'),
    UserSubject: graph.getSubject('User'),
    TeamSubject: graph.getSubject('Team'),
    OrganizationResource: graph.getResource('Organization'),
    OrganizationSubject: graph.getSubject('Organization')
};
var orgA, orgB, teamA1, teamA2, teamA3, teamB1, userA1, userA2, userB1, blogA1, blogB1, postB1a, postB1b, postA1a;
ava_1.default.beforeEach(function () __awaiter(this, void 0, void 0, function* () {
    helpers.uidReset();
    orgA = helpers.org();
    orgB = helpers.org();
    teamA1 = helpers.team(orgA);
    teamA2 = helpers.team(orgA);
    teamA3 = helpers.team(orgA);
    teamB1 = helpers.team(orgB);
    userA1 = helpers.user([teamA1, teamA2]);
    userA2 = helpers.user([teamA1, teamA3]);
    userB1 = helpers.user([teamB1]);
    blogA1 = helpers.blog(orgA);
    blogB1 = helpers.blog(orgB);
    postB1a = helpers.post(blogB1);
    postB1b = helpers.post(blogB1);
    postA1a = helpers.post(blogA1);
    yield Promise.all([
        classes.orgModel.saveEntity(orgA.id, orgA),
        classes.orgModel.saveEntity(orgB.id, orgB),
        classes.teamModel.saveEntity(teamA1.id, teamA1),
        classes.teamModel.saveEntity(teamA2.id, teamA2),
        classes.teamModel.saveEntity(teamA3.id, teamA3),
        classes.teamModel.saveEntity(teamB1.id, teamB1),
        classes.userModel.saveEntity(userA1.id, userA1),
        classes.userModel.saveEntity(userA2.id, userA2),
        classes.userModel.saveEntity(userB1.id, userB1),
        classes.blogModel.saveEntity(blogA1.id, blogA1),
        classes.blogModel.saveEntity(blogB1.id, blogB1),
        classes.postModel.saveEntity(postA1a.id, postA1a),
        classes.postModel.saveEntity(postB1a.id, postB1a),
        classes.postModel.saveEntity(postB1b.id, postB1b)
    ]);
}));
ava_1.default('yes() should return true', function () {
    chai_1.expect(util.yes()).to.equal(true);
});
ava_1.default('noop() should return void', function () {
    chai_1.expect(util.noop()).to.equal(void 0);
});
ava_1.default('baseCompare() should correctly order items', function () {
    chai_1.expect(util.baseCompare('x', 'y'), 'a < b  -> -1').to.equal(-1);
    chai_1.expect(util.baseCompare('y', 'x'), 'a > b  -> 1').to.equal(1);
    chai_1.expect(util.baseCompare('x', 'x'), 'a == b -> 0').to.equal(0);
});
ava_1.default('binaryIndexOf() should correctly find indexes on sorted arrays', function () {
    var A = ['a', 'b', 'c', 'd'], B = ['t', 'u', 'v', 'w', 'x', 'y', 'z'];
    chai_1.expect(util.binaryIndexOf(A, 'c'), 'Correctly finds c in the array').to.equal(2);
    chai_1.expect(util.binaryIndexOf(B, 'y'), 'Correctly finds y in the array').to.equal(5);
    chai_1.expect(util.binaryIndexOf(B, 'q'), 'Returns -1 on not finding value').to.equal(-1);
});
ava_1.default('topologicalSort should correctly sort nodes', function () {
    var nodes = [
        { name: 'B', parent: 'A' },
        { name: 'A', parent: 'C' },
        { name: 'C' }
    ];
    chai_1.expect(util.topologicalSort(nodes))
        .to.deep.equal([
        { name: 'C' },
        { name: 'A', parent: 'C' },
        { name: 'B', parent: 'A' }
    ]);
});
ava_1.default('topologicalSort should detect circular dependencies', function () {
    var nodes = [
        { name: 'A', parent: 'B' },
        { name: 'B', parent: 'A' }
    ];
    chai_1.expect(function () { return util.topologicalSort(nodes); })
        .to.throw(/Schema has a circular dependency or a missing parent/);
});
ava_1.default.serial('Creating a node subclass without a repository should throw on instantiation', function () {
    var TestResource = (function (_super) {
        __extends(TestResource, _super);
        function TestResource() {
            _super.apply(this, arguments);
        }
        return TestResource;
    }(gracl_1.Resource));
    ;
    var TestSubject = (function (_super) {
        __extends(TestSubject, _super);
        function TestSubject() {
            _super.apply(this, arguments);
        }
        return TestSubject;
    }(gracl_1.Subject));
    ;
    chai_1.expect(function () { return (new TestResource({})); }, 'Instantiate Resource').to.throw();
    chai_1.expect(function () { return (new TestSubject({})); }, 'Instantiate Subject').to.throw();
});
ava_1.default.serial('Retrieving document from repository should work', function () __awaiter(this, void 0, void 0, function* () {
    chai_1.expect(yield classes.orgModel.getEntity(orgA.id), 'Memory Repository should sucessfully set items').to.equal(orgA);
}));
ava_1.default.serial('Graph classes should have proper inheritance chain', function () {
    var PostResource = graphClasses.PostResource, BlogResource = graphClasses.BlogResource, UserSubject = graphClasses.UserSubject, TeamSubject = graphClasses.TeamSubject, OrganizationResource = graphClasses.OrganizationResource, OrganizationSubject = graphClasses.OrganizationSubject;
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
ava_1.default.serial('Graph classes return correct node depth', function () {
    var BlogResource = graphClasses.BlogResource, UserSubject = graphClasses.UserSubject;
    chai_1.expect(BlogResource.getNodeDepth()).to.equal(2);
    chai_1.expect(UserSubject.getNodeDepth()).to.equal(3);
});
ava_1.default.serial('Graph should throw if there is an undefined parent', function () {
    var createGraph = function () { return new gracl_1.Graph({
        resources: [
            { name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel },
            { name: 'Organization', repository: classes.orgModel }
        ],
        subjects: [
            { name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel },
            { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel },
            { name: 'Organization', repository: classes.orgModel }
        ]
    }); };
    chai_1.expect(createGraph).to.throw();
});
ava_1.default.serial('Graph should throw if there is a circular dependency', function () {
    var createGraph = function () { return new gracl_1.Graph({
        resources: [
            { name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel },
            { name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel },
            { name: 'Organization', parent: 'Post', repository: classes.orgModel }
        ],
        subjects: [
            { name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel },
            { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel },
            { name: 'Organization', repository: classes.orgModel }
        ]
    }); };
    chai_1.expect(createGraph).to.throw();
});
_.forEach([
    {
        description: 'user instantiated classes',
        classes: classes
    },
    {
        description: 'classes created by graph',
        classes: graphClasses
    }
], function (test) {
    runNodeTestsWithClasses(test.description, test.classes);
});
function runNodeTestsWithClasses(description, nodeClasses) {
    ava_1.default.serial(description + ' Resource.getParents() should return Resource instances of parent objects', function () __awaiter(this, void 0, void 0, function* () {
        var resource = new nodeClasses.PostResource(postA1a);
        var parent = (yield resource.getParents())[0];
        chai_1.expect(parent, 'Returned parent should be gracl node instance.').to.be.instanceof(nodeClasses.BlogResource);
        chai_1.expect(parent.getId(), 'Correct parent should be returned.').to.equal(blogA1.id);
    }));
    ava_1.default.serial(description + ' Resource.allow(Subject, <perm>) -> subject can access resource.', function () __awaiter(this, void 0, void 0, function* () {
        var resource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
        var initialAllowed = yield resource.isAllowed(subject, 'view');
        chai_1.expect(yield resource.allow(subject, 'view'), 'Setting permission should return same resource type.').to.be.instanceof(nodeClasses.PostResource);
        var afterSetAllowed = yield resource.isAllowed(subject, 'view');
        chai_1.expect(initialAllowed, 'the subject should not yet be allowed to view the resource.').to.equal(false);
        chai_1.expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
    }));
    ava_1.default.serial(description + ' Resource.allow(Subject, <perm>) -> resource should have permission with subjectType and resourceType set.', function () __awaiter(this, void 0, void 0, function* () {
        var resource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
        yield resource.allow(subject, 'view');
        var permission = resource.doc[permissionKey][0];
        chai_1.expect(permission.resourceType).to.equal(resource.getName());
        chai_1.expect(permission.subjectType).to.equal(subject.getName());
    }));
    ava_1.default.serial(description + ' Resource.allow(parentSubject, <perm>) -> child subject can access resource.', function () __awaiter(this, void 0, void 0, function* () {
        var parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
        var initialAllowed = yield childResource.isAllowed(subject, 'view');
        chai_1.expect(yield parentResource.allow(subject, 'view'), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(nodeClasses.BlogResource);
        var afterSetAllowed = yield childResource.isAllowed(subject, 'view');
        chai_1.expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
        chai_1.expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
    }));
    ava_1.default.serial(description + ' parentResource.allow(parentSubject, <perm>) -> child subject can access child resource.', function () __awaiter(this, void 0, void 0, function* () {
        var parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
        var initialAllowed = yield childResource.isAllowed(childSubject, 'view');
        chai_1.expect(yield parentResource.allow(parentSubject, 'view'), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(nodeClasses.BlogResource);
        var afterSetAllowed = yield childResource.isAllowed(childSubject, 'view');
        chai_1.expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
        chai_1.expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
    }));
    ava_1.default.serial(description + ' Permissions should be visible through resource.getPermissionsHierarchy()', function () __awaiter(this, void 0, void 0, function* () {
        var parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
        yield parentResource.allow(subject, 'view');
        var hiearchy = yield childResource.getPermissionsHierarchy();
        chai_1.expect(hiearchy.node, 'Node should be string representation.').to.equal(childResource.toString());
        chai_1.expect(hiearchy.parents[0].permissions, 'Parent resource should have one permission.').to.have.length(1);
        chai_1.expect(hiearchy.parents[0].permissions[0].access['view'], 'View access should be true').to.equal(true);
    }));
    ava_1.default.serial(description + ' Lowest node on hierarchy wins conflicts (deny post for team)', function () __awaiter(this, void 0, void 0, function* () {
        var parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
        chai_1.expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post before permission set.').to.equal(false);
        yield parentResource.allow(parentSubject, 'view');
        yield childResource.deny(parentSubject, 'view');
        chai_1.expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(true);
        chai_1.expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(false);
        chai_1.expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(true);
        chai_1.expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post after permission set.').to.equal(false);
    }));
    ava_1.default.serial(description + ' Lowest node on hierarchy wins conflicts (deny post for team, but allow for user)', function () __awaiter(this, void 0, void 0, function* () {
        var parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
        chai_1.expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post before permission set.').to.equal(false);
        yield parentResource.allow(parentSubject, 'view');
        yield childResource.deny(parentSubject, 'view');
        yield childResource.allow(childSubject, 'view');
        yield parentResource.deny(childSubject, 'view');
        chai_1.expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(true);
        chai_1.expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(false);
        chai_1.expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(false);
        chai_1.expect(yield childResource.isAllowed(childSubject, 'view'), 'User should have access to post after permission set.').to.equal(true);
    }));
    ava_1.default.serial(description + ' childResource.deny(parentSubject) should win over parentResource.allow(childSubject)', function () __awaiter(this, void 0, void 0, function* () {
        var parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
        yield parentResource.allow(childSubject, 'view');
        yield childResource.deny(parentSubject, 'view');
        var access = yield childResource.isAllowed(childSubject, 'view');
        chai_1.expect(access, 'should not have access').to.equal(false);
    }));
    ava_1.default.serial(description + ' Permission explainations should be accurate', function () __awaiter(this, void 0, void 0, function* () {
        var parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
        yield parentResource.allow(parentSubject, 'view');
        yield childResource.deny(parentSubject, 'view');
        var reason = "Permission set on <Resource:" + childResource.getName() + " id=p0014> for <Subject:" + parentSubject.getName() + " id=t003> = false";
        chai_1.expect(yield childResource.explainPermission(childSubject, 'view'), 'Explaining why child subject cannot access child resource').to.equal(reason);
    }));
    ava_1.default.serial(description + ' Subject method results should equal resource method results', function () __awaiter(this, void 0, void 0, function* () {
        var parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
        yield parentResource.allow(parentSubject, 'view');
        yield childResource.deny(parentSubject, 'view');
        chai_1.expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(yield parentSubject.isAllowed(parentResource, 'view'));
        chai_1.expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(yield parentSubject.isAllowed(childResource, 'view'));
        chai_1.expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(yield childSubject.isAllowed(parentResource, 'view'));
        chai_1.expect(yield childResource.isAllowed(childSubject, 'view'), 'User should have access to post after permission set.').to.equal(yield childSubject.isAllowed(childResource, 'view'));
    }));
    ava_1.default.serial(description + ' Node.getHierarchyIds() should return flattened array of correct ids', function () __awaiter(this, void 0, void 0, function* () {
        var childResource = new nodeClasses.PostResource(postA1a);
        chai_1.expect(yield childResource.getHierarchyIds(), 'Post -> Blog -> Org').to.deep.equal(['p0014', 'b0010', 'o001']);
    }));
    ava_1.default.serial(description + ' Node.getHierarchyClassNames() should return array of class names', function () {
        var childResource = new nodeClasses.PostResource(postA1a), childSubject = new nodeClasses.UserSubject(userA1);
        var name = function (c) { return (c.displayName || c.name); };
        chai_1.expect(childResource.getHierarchyClassNames(), 'resource class names')
            .to.deep.equal([name(nodeClasses.PostResource), name(nodeClasses.BlogResource), name(nodeClasses.OrganizationResource)]);
        chai_1.expect(childSubject.getHierarchyClassNames(), 'subject class names')
            .to.deep.equal([name(nodeClasses.UserSubject), name(nodeClasses.TeamSubject), name(nodeClasses.OrganizationSubject)]);
    });
    ava_1.default.serial(description + ' Should get access through parent having access to itself', function () __awaiter(this, void 0, void 0, function* () {
        var parentResource = new nodeClasses.OrganizationResource(orgA), parentSubject = new nodeClasses.OrganizationSubject(orgA), childSubject = new nodeClasses.UserSubject(userA1);
        yield parentResource.allow(parentSubject, 'view');
        var perm = yield parentResource.determineAccess(childSubject, 'view');
        chai_1.expect(perm.access, 'child should have access through parent -> parent').to.equal(true);
    }));
}
