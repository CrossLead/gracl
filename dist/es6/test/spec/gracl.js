var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { expect } from 'chai';
import * as classes from '../classes/index';
import * as helpers from '../helpers/index';
import { Resource, Subject, MemoryRepository, Graph } from '../../lib/index';
const graph = new Graph({
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
            class TestResource extends Resource {
            }
            ;
            class TestSubject extends Subject {
            }
            ;
            expect(() => new TestResource({}), 'Instantiate Resource').to.throw();
            expect(() => new TestResource({}), 'Instantiate Subject').to.throw();
        });
        it('Should use displayName if provided in Node.toString()', () => {
            class TestResource extends Resource {
            }
            TestResource.displayName = 'MY_RESOURCE';
            TestResource.repository = new MemoryRepository();
            const node = new TestResource({ id: 1 });
            expect(node.getName()).to.equal(TestResource.displayName);
            expect(node.toString()).to.equal(`<Resource:${TestResource.displayName} id=1>`);
        });
        it('Retrieving document from repository should work', () => __awaiter(this, void 0, void 0, function* () {
            expect(yield classes.orgModel.getEntity(orgA.id), 'Memory Repository should sucessfully set items').to.equal(orgA);
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
            expect(PostResourceInstance, 'Post -> Blog').to.be.instanceof(BlogResource);
            expect(PostResourceInstance, 'Post -> Org').to.be.instanceof(OrganizationResource);
            expect(UserSubjectInstance, 'User -> Team').to.be.instanceof(TeamSubject);
            expect(UserSubjectInstance, 'User -> Org').to.be.instanceof(OrganizationSubject);
        });
        it('Graph should throw if there is an undefined parent', () => {
            const createGraph = () => new Graph({
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
            expect(createGraph).to.throw();
        });
        it('Graph should throw if there is a circular dependency', () => {
            const createGraph = () => new Graph({
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
            expect(createGraph).to.throw();
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
                expect(parent, 'Returned parent should be gracl node instance.').to.be.instanceof(nodeClasses.BlogResource);
                expect(parent.getId(), 'Correct parent should be returned.').to.equal(blogA1.id);
            }));
            it('Resource.allow(Subject, <perm>) -> subject can access resource.', () => __awaiter(this, void 0, void 0, function* () {
                const resource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                const initialAllowed = yield resource.isAllowed(subject, 'view');
                expect(yield resource.allow(subject, 'view'), 'Setting permission should return same resource type.').to.be.instanceof(nodeClasses.PostResource);
                const afterSetAllowed = yield resource.isAllowed(subject, 'view');
                expect(initialAllowed, 'the subject should not yet be allowed to view the resource.').to.equal(false);
                expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
            }));
            it('Resource.allow(Subject, <perm>) -> resource should have permission with subjectType and resourceType set.', () => __awaiter(this, void 0, void 0, function* () {
                const resource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                yield resource.allow(subject, 'view');
                const [permission] = resource.doc.permissions;
                expect(permission.resourceType).to.equal(resource.getName());
                expect(permission.subjectType).to.equal(subject.getName());
            }));
            it('Resource.allow(parentSubject, <perm>) -> child subject can access resource.', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                const initialAllowed = yield childResource.isAllowed(subject, 'view');
                expect(yield parentResource.allow(subject, 'view'), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(nodeClasses.BlogResource);
                const afterSetAllowed = yield childResource.isAllowed(subject, 'view');
                expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
                expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
            }));
            it('parentResource.allow(parentSubject, <perm>) -> child subject can access child resource.', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                const initialAllowed = yield childResource.isAllowed(childSubject, 'view');
                expect(yield parentResource.allow(parentSubject, 'view'), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(nodeClasses.BlogResource);
                const afterSetAllowed = yield childResource.isAllowed(childSubject, 'view');
                expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
                expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
            }));
            it('Permissions should be visible through resource.getPermissionsHierarchy()', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), subject = new nodeClasses.UserSubject(userA1);
                yield parentResource.allow(subject, 'view');
                const hiearchy = yield childResource.getPermissionsHierarchy();
                expect(hiearchy.node, 'Node should be string representation.').to.equal(childResource.toString());
                expect(hiearchy.parents[0].permissions, 'Parent resource should have one permission.').to.have.length(1);
                expect(hiearchy.parents[0].permissions[0].access['view'], 'View access should be true').to.equal(true);
            }));
            it('Lowest node on hierarchy wins conflicts (deny post for team)', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post before permission set.').to.equal(false);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(true);
                expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(false);
                expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(true);
                expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post after permission set.').to.equal(false);
            }));
            it('Lowest node on hierarchy wins conflicts (deny post for team, but allow for user)', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post before permission set.').to.equal(false);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                yield childResource.allow(childSubject, 'view');
                yield parentResource.deny(childSubject, 'view');
                expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(true);
                expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(false);
                expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(false);
                expect(yield childResource.isAllowed(childSubject, 'view'), 'User should have access to post after permission set.').to.equal(true);
            }));
            it('Permission explainations should be accurate', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                const reason = `Permission set on <Resource:${childResource.getName()} id=p0014> for <Subject:${parentSubject.getName()} id=t003> = false`;
                expect(yield childResource.explainPermission(childSubject, 'view'), 'Explaining why child subject cannot access child resource').to.equal(reason);
            }));
            it('Subject method results should equal resource method results', () => __awaiter(this, void 0, void 0, function* () {
                const parentResource = new nodeClasses.BlogResource(blogA1), childResource = new nodeClasses.PostResource(postA1a), parentSubject = new nodeClasses.TeamSubject(teamA1), childSubject = new nodeClasses.UserSubject(userA1);
                yield parentResource.allow(parentSubject, 'view');
                yield childResource.deny(parentSubject, 'view');
                expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(yield parentSubject.isAllowed(parentResource, 'view'));
                expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(yield parentSubject.isAllowed(childResource, 'view'));
                expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(yield childSubject.isAllowed(parentResource, 'view'));
                expect(yield childResource.isAllowed(childSubject, 'view'), 'User should have access to post after permission set.').to.equal(yield childSubject.isAllowed(childResource, 'view'));
            }));
            it('Node.getHierarchyIds() should return flattened array of correct ids', () => __awaiter(this, void 0, void 0, function* () {
                const childResource = new nodeClasses.PostResource(postA1a);
                expect(yield childResource.getHierarchyIds(), 'Post -> Blog -> Org').to.deep.equal(['p0014', 'b0010', 'o001']);
            }));
            it('Node.getHierarchyClassNames() should return array of class names', () => {
                const childResource = new nodeClasses.PostResource(postA1a), childSubject = new nodeClasses.UserSubject(userA1);
                const name = (c) => (c.displayName || c.name);
                expect(childResource.getHierarchyClassNames(), 'resource class names')
                    .to.deep.equal([name(nodeClasses.PostResource), name(nodeClasses.BlogResource), name(nodeClasses.OrganizationResource)]);
                expect(childSubject.getHierarchyClassNames(), 'subject class names')
                    .to.deep.equal([name(nodeClasses.UserSubject), name(nodeClasses.TeamSubject), name(nodeClasses.OrganizationSubject)]);
            });
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhY2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L3NwZWMvZ3JhY2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7T0FDTyxFQUFFLE1BQU0sRUFBRSxNQUFNLE1BQU07T0FDdEIsS0FBSyxPQUFPLE1BQU0sa0JBQWtCO09BQ3BDLEtBQUssT0FBTyxNQUFNLGtCQUFrQjtPQUNwQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0saUJBQWlCO0FBVzVFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDO0lBQ3RCLFNBQVMsRUFBRTtRQUNULEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUU7UUFDbkYsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ25HLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRTtLQUN2RDtJQUNELFFBQVEsRUFBRTtRQUNSLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUU7UUFDcEYsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ25HLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRTtLQUN2RDtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sWUFBWSxHQUFHO0lBQ25CLFlBQVksRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUN2QyxZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDdkMsV0FBVyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQ3JDLFdBQVcsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQztJQUN2RCxtQkFBbUIsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztDQUN0RCxDQUFDO0FBRUYsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixJQUFJLElBQVMsRUFDVCxJQUFTLEVBQ1QsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsT0FBWSxFQUNaLE9BQVksRUFDWixPQUFZLENBQUM7SUFFakIsTUFBTSxhQUFhLEdBQUc7UUFDcEIsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBR25CLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVyQixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFFLE1BQU0sRUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBRSxDQUFDLENBQUM7UUFDMUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBRSxNQUFNLENBQUUsQ0FBQyxDQUFDO1FBRWxDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9CLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUNoQixPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztZQUMxQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztZQUUxQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUUvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVB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