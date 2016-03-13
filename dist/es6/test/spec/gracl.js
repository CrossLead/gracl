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
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhY2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L3NwZWMvZ3JhY2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsdUJBQXVCLE1BQU0sQ0FBQyxDQUFBO0FBQzlCLE1BQVksT0FBTyxXQUFNLGtCQUFrQixDQUFDLENBQUE7QUFDNUMsTUFBWSxPQUFPLFdBQU0sa0JBQWtCLENBQUMsQ0FBQTtBQUM1Qyx3QkFBMkQsaUJBQWlCLENBQUMsQ0FBQTtBQVc3RSxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQztJQUN0QixTQUFTLEVBQUU7UUFDVCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ25GLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtRQUNuRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7S0FDdkQ7SUFDRCxRQUFRLEVBQUU7UUFDUixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ3BGLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtRQUNuRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7S0FDdkQ7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLFlBQVksR0FBRztJQUNuQixZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDdkMsWUFBWSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLFdBQVcsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDckMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUM7SUFDdkQsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7Q0FDdEQsQ0FBQztBQUVGLFFBQVEsQ0FBQyxPQUFPLEVBQUU7SUFDaEIsSUFBSSxJQUFTLEVBQ1QsSUFBUyxFQUNULE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE9BQVksRUFDWixPQUFZLEVBQ1osT0FBWSxDQUFDO0lBRWpCLE1BQU0sYUFBYSxHQUFHO1FBQ3BCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUduQixJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFckIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFNUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBRSxNQUFNLEVBQUUsTUFBTSxDQUFFLENBQUMsQ0FBQztRQUMxQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFFLE1BQU0sRUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUUsTUFBTSxDQUFFLENBQUMsQ0FBQztRQUVsQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvQixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDaEIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7WUFDMUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7WUFFMUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFFL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFD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