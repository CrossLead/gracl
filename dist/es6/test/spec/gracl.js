"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const chai_1 = require('chai');
const classes = require('../classes/index');
const helpers = require('../helpers/index');
const index_1 = require('../../lib/index');
const graph = new index_1.Graph({
    resources: [
        { name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel },
        { name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel },
        { name: 'Organization', repository: classes.orgModel }
    ],
    subjects: [
        { name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel },
        { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel },
        { name: 'Organization', repository: classes.orgModel }
    ]
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
    const resetTestData = () => __awaiter(this, void 0, void 0, function* () {
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
    });
    describe('- Class tests', () => {
        beforeEach(resetTestData);
        it('Creating a node subclass without a repository should throw on instantiation', () => {
            class TestResource extends index_1.Resource {
            }
            ;
            class TestSubject extends index_1.Subject {
            }
            ;
            chai_1.expect(() => new TestResource({}), 'Instantiate Resource').to.throw();
            chai_1.expect(() => new TestResource({}), 'Instantiate Subject').to.throw();
        });
        it('Should use displayName if provided in Node.toString()', () => {
            class TestResource extends index_1.Resource {
            }
            TestResource.displayName = 'MY_RESOURCE';
            TestResource.repository = new index_1.MemoryRepository();
            const node = new TestResource({ id: 1 });
            chai_1.expect(node.getName()).to.equal(TestResource.displayName);
            chai_1.expect(node.toString()).to.equal(`<Resource:${TestResource.displayName} id=1>`);
        });
        it('Retrieving document from repository should work', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(yield classes.orgModel.getEntity(orgA.id), 'Memory Repository should sucessfully set items').to.equal(orgA);
        }));
    });
    describe('- Graph specific tests', () => {
        beforeEach(resetTestData);
        it('Graph classes should have proper inheritance chain', () => {
            const { PostResource, BlogResource, UserSubject, TeamSubject, OrganizationResource, OrganizationSubject } = graphClasses;
            const PostResourceInstance = new PostResource({ id: 1 });
            const BlogResourceInstance = new BlogResource({ id: 1 });
            const UserSubjectInstance = new UserSubject({ id: 1 });
            const TeamSubjectInstance = new TeamSubject({ id: 1 });
            const OrganizationResourceInstance = new OrganizationResource({ id: 1 });
            const OrganizationSubjectInstance = new OrganizationSubject({ id: 1 });
            chai_1.expect(PostResourceInstance, 'Post -> Blog').to.be.instanceof(BlogResource);
            chai_1.expect(PostResourceInstance, 'Post -> Org').to.be.instanceof(OrganizationResource);
            chai_1.expect(UserSubjectInstance, 'User -> Team').to.be.instanceof(TeamSubject);
            chai_1.expect(UserSubjectInstance, 'User -> Org').to.be.instanceof(OrganizationSubject);
        });
        it('Graph should throw if there is an undefined parent', () => {
            const createGraph = () => new index_1.Graph({
                resources: [
                    { name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel },
                    { name: 'Organization', repository: classes.orgModel }
                ],
                subjects: [
                    { name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel },
                    { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel },
                    { name: 'Organization', repository: classes.orgModel }
                ]
            });
            chai_1.expect(createGraph).to.throw();
        });
        it('Graph should throw if there is a circular dependency', () => {
            const createGraph = () => new index_1.Graph({
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
            });
            chai_1.expect(createGraph).to.throw();
        });
    });
    describe('- Node permission tests', () => {
        beforeEach(resetTestData);
        const testCases = [
            {
                description: 'user instantiated classes',
                classes: classes
            },
            {
                description: 'classes created by graph',
                classes: graphClasses
            }
        ];
        testCases.forEach(test => {
            describe('- Permissions tests using ' + test.description, () => {
                runNodeTestsWithClasses(test.classes);
            });
        });
        function runNodeTestsWithClasses(nodeClasses) {
            it('Resource.getParents() should return Resource instances of parent objects', () => __awaiter(this, void 0, void 0, function* () {
                const resource = new nodeClasses.PostResource(postA1a);
                const [parent] = yield resource.getParents();
                chai_1.expect(parent, 'Returned parent should be gracl node instance.').to.be.instanceof(nodeClasses.BlogResource);
                chai_1.expect(parent.getId(), 'Correct parent should be returned.').to.equal(blogA1.id);
            }));
            it('Resource.allow(Subject, <perm>) -> subject can access resource.', () => __awaiter(this, void 0, void 0, function* () {
                const resource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                const initialAllowed = yield resource.isAllowed(subject, 'view');
                chai_1.expect(yield resource.allow(subject, 'view'), 'Setting permission should return same resource type.').to.be.instanceof(nodeClasses.PostResource);
                const afterSetAllowed = yield resource.isAllowed(subject, 'view');
                chai_1.expect(initialAllowed, 'the subject should not yet be allowed to view the resource.').to.equal(false);
                chai_1.expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
            }));
            it('Resource.allow(parentSubject, <perm>) -> child subject can access resource.', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                const initialAllowed = yield childResource.isAllowed(subject, 'view');
                chai_1.expect(yield parentResource.allow(subject, 'view'), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(nodeClasses.BlogResource);
                const afterSetAllowed = yield childResource.isAllowed(subject, 'view');
                chai_1.expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
                chai_1.expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
            }));
            it('parentResource.allow(parentSubject, <perm>) -> child subject can access child resource.', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                const initialAllowed = yield childResource.isAllowed(childSubject, 'view');
                chai_1.expect(yield parentResource.allow(parentSubject, 'view'), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(nodeClasses.BlogResource);
                const afterSetAllowed = yield childResource.isAllowed(childSubject, 'view');
                chai_1.expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
                chai_1.expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
            }));
            it('Permissions should be visible through resource.getPermissionsHierarchy()', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                yield parentResource.allow(subject, 'view');
                const hiearchy = yield childResource.getPermissionsHierarchy();
                chai_1.expect(hiearchy.node, 'Node should be string representation.').to.equal(childResource.toString());
                chai_1.expect(hiearchy.parents[0].permissions, 'Parent resource should have one permission.').to.have.length(1);
                chai_1.expect(hiearchy.parents[0].permissions[0].access['view'], 'View access should be true').to.equal(true);
            }));
            it('Lowest node on hierarchy wins conflicts (deny post for team)', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                chai_1.expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post before permission set.').to.equal(false);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                chai_1.expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(true);
                chai_1.expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(false);
                chai_1.expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(true);
                chai_1.expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post after permission set.').to.equal(false);
            }));
            it('Lowest node on hierarchy wins conflicts (deny post for team, but allow for user)', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
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
            it('Permission explainations should be accurate', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                const reason = `Permission set on <Resource:${childResource.getName()} id=p0014> for <Subject:${parentSubject.getName()} id=t003> = false`;
                chai_1.expect(yield childResource.explainPermission(childSubject, 'view'), 'Explaining why child subject cannot access child resource').to.equal(reason);
            }));
            it('Subject method results should equal resource method results', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                chai_1.expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(yield parentSubject.isAllowed(parentResource, 'view'));
                chai_1.expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(yield parentSubject.isAllowed(childResource, 'view'));
                chai_1.expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(yield childSubject.isAllowed(parentResource, 'view'));
                chai_1.expect(yield childResource.isAllowed(childSubject, 'view'), 'User should have access to post after permission set.').to.equal(yield childSubject.isAllowed(childResource, 'view'));
            }));
            it('Node.getHierarchyIds() should return flattened array of correct ids', () => __awaiter(this, void 0, void 0, function* () {
                const childResource = new nodeClasses.PostResource(postA1a);
                chai_1.expect(yield childResource.getHierarchyIds(), 'Post -> Blog -> Org').to.deep.equal(['p0014', 'b0010', 'o001']);
            }));
            it('Node.getHierarchyClassNames() should return array of class names', () => {
                const childResource = new nodeClasses.PostResource(postA1a), childSubject = new nodeClasses.UserSubject(userA1);
                const name = (c) => (c.displayName || c.name);
                chai_1.expect(childResource.getHierarchyClassNames(), 'resource class names')
                    .to.deep.equal([name(nodeClasses.PostResource), name(nodeClasses.BlogResource), name(nodeClasses.OrganizationResource)]);
                chai_1.expect(childSubject.getHierarchyClassNames(), 'subject class names')
                    .to.deep.equal([name(nodeClasses.UserSubject), name(nodeClasses.TeamSubject), name(nodeClasses.OrganizationSubject)]);
            });
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhY2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L3NwZWMvZ3JhY2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsdUJBQXVCLE1BQU0sQ0FBQyxDQUFBO0FBQzlCLE1BQVksT0FBTyxXQUFNLGtCQUFrQixDQUFDLENBQUE7QUFDNUMsTUFBWSxPQUFPLFdBQU0sa0JBQWtCLENBQUMsQ0FBQTtBQUM1Qyx3QkFBMkQsaUJBQWlCLENBQUMsQ0FBQTtBQVc3RSxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQztJQUN0QixTQUFTLEVBQUU7UUFDVCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ25GLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtRQUNuRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDUixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ3BGLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtRQUNuRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7S0FDdkQ7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLFlBQVksR0FBRztJQUNuQixZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDdkMsWUFBWSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLFdBQVcsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDckMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUM7SUFDdkQsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7Q0FDdEQsQ0FBQztBQUVGLFFBQVEsQ0FBQyxPQUFPLEVBQUU7SUFDaEIsSUFBSSxJQUFTLEVBQ1QsSUFBUyxFQUNULE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE9BQVksRUFDWixPQUFZLEVBQ1osT0FBWSxDQUFDO0lBRWpCLE1BQU0sYUFBYSxHQUFHO1FBQ3BCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUduQixJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFckIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFNUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBRSxNQUFNLEVBQUUsTUFBTSxDQUFFLENBQUMsQ0FBQztRQUMxQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFFLE1BQU0sRUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUUsTUFBTSxDQUFFLENBQUMsQ0FBQztRQUVsQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvQixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDaEIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7WUFDMUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7WUFFMUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFFL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFD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