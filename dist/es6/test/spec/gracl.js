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
import { Resource, Subject, MemoryRepository } from '../../lib/index';
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
    it('Retrieving document from repository should work', () => __awaiter(this, void 0, void 0, function* () {
        expect(yield classes.orgModel.getEntity(orgA.id), 'Memory Repository should sucessfully set items').to.equal(orgA);
    }));
    it('Resource.getParents() should return Resource instances of parent objects', () => __awaiter(this, void 0, void 0, function* () {
        const resource = new classes.PostResource(postA1a);
        const [parent] = yield resource.getParents();
        expect(parent, 'Returned parent should be gracl node instance.').to.be.instanceof(classes.BlogResource);
        expect(parent.getId(), 'Correct parent should be returned.').to.equal(blogA1.id);
    }));
    it('Resource.allow(Subject, <perm>) -> subject can access resource.', () => __awaiter(this, void 0, void 0, function* () {
        const resource = new classes.PostResource(postA1a), subject = new classes.UserSubject(userA1);
        const initialAllowed = yield resource.isAllowed(subject, 'view');
        expect(yield resource.allow(subject, 'view'), 'Setting permission should return same resource type.').to.be.instanceof(classes.PostResource);
        const afterSetAllowed = yield resource.isAllowed(subject, 'view');
        expect(initialAllowed, 'the subject should not yet be allowed to view the resource.').to.equal(false);
        expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
    }));
    it('Resource.allow(parentSubject, <perm>) -> child subject can access resource.', () => __awaiter(this, void 0, void 0, function* () {
        const parentResource = new classes.BlogResource(blogA1), childResource = new classes.PostResource(postA1a), subject = new classes.UserSubject(userA1);
        const initialAllowed = yield childResource.isAllowed(subject, 'view');
        expect(yield parentResource.allow(subject, 'view'), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(classes.BlogResource);
        const afterSetAllowed = yield childResource.isAllowed(subject, 'view');
        expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
        expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
    }));
    it('parentResource.allow(parentSubject, <perm>) -> child subject can access child resource.', () => __awaiter(this, void 0, void 0, function* () {
        const parentResource = new classes.BlogResource(blogA1), childResource = new classes.PostResource(postA1a), parentSubject = new classes.TeamSubject(teamA1), childSubject = new classes.UserSubject(userA1);
        const initialAllowed = yield childResource.isAllowed(childSubject, 'view');
        expect(yield parentResource.allow(parentSubject, 'view'), 'Setting permission for parentSubject should return same resource type.').to.be.instanceof(classes.BlogResource);
        const afterSetAllowed = yield childResource.isAllowed(childSubject, 'view');
        expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
        expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
    }));
    it('Permissions should be visible through resource.getPermissionsHierarchy()', () => __awaiter(this, void 0, void 0, function* () {
        const parentResource = new classes.BlogResource(blogA1), childResource = new classes.PostResource(postA1a), subject = new classes.UserSubject(userA1);
        yield parentResource.allow(subject, 'view');
        const hiearchy = yield childResource.getPermissionsHierarchy();
        expect(hiearchy.node, 'Node should be string representation.').to.equal(childResource.toString());
        expect(hiearchy.parents[0].permissions, 'Parent resource should have one permission.').to.have.length(1);
        expect(hiearchy.parents[0].permissions[0].access['view'], 'View access should be true').to.equal(true);
    }));
    it('Lowest node on hierarchy wins conflicts (deny post for team)', () => __awaiter(this, void 0, void 0, function* () {
        const parentResource = new classes.BlogResource(blogA1), childResource = new classes.PostResource(postA1a), parentSubject = new classes.TeamSubject(teamA1), childSubject = new classes.UserSubject(userA1);
        expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post before permission set.').to.equal(false);
        yield parentResource.allow(parentSubject, 'view');
        yield childResource.deny(parentSubject, 'view');
        expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(true);
        expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(false);
        expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(true);
        expect(yield childResource.isAllowed(childSubject, 'view'), 'User should not have access to post after permission set.').to.equal(false);
    }));
    it('Lowest node on hierarchy wins conflicts (deny post for team, but allow for user)', () => __awaiter(this, void 0, void 0, function* () {
        const parentResource = new classes.BlogResource(blogA1), childResource = new classes.PostResource(postA1a), parentSubject = new classes.TeamSubject(teamA1), childSubject = new classes.UserSubject(userA1);
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
        const parentResource = new classes.BlogResource(blogA1), childResource = new classes.PostResource(postA1a), parentSubject = new classes.TeamSubject(teamA1), childSubject = new classes.UserSubject(userA1);
        yield parentResource.allow(parentSubject, 'view');
        yield childResource.deny(parentSubject, 'view');
        const reason = 'Permission set on <Resource:PostResource id=p0014> for <Subject:TeamSubject id=t003> = false';
        expect(yield childResource.explainPermission(childSubject, 'view'), 'Explaining why child subject cannot access child resource').to.equal(reason);
    }));
    it('Subject method results should equal resource method results', () => __awaiter(this, void 0, void 0, function* () {
        const parentResource = new classes.BlogResource(blogA1), childResource = new classes.PostResource(postA1a), parentSubject = new classes.TeamSubject(teamA1), childSubject = new classes.UserSubject(userA1);
        yield parentResource.allow(parentSubject, 'view');
        yield childResource.deny(parentSubject, 'view');
        expect(yield parentResource.isAllowed(parentSubject, 'view'), 'Team should have access to blog after permission set').to.equal(yield parentSubject.isAllowed(parentResource, 'view'));
        expect(yield childResource.isAllowed(parentSubject, 'view'), 'Team should not have access to post after permission set.').to.equal(yield parentSubject.isAllowed(childResource, 'view'));
        expect(yield parentResource.isAllowed(childSubject, 'view'), 'User should have access to blog after permission set').to.equal(yield childSubject.isAllowed(parentResource, 'view'));
        expect(yield childResource.isAllowed(childSubject, 'view'), 'User should have access to post after permission set.').to.equal(yield childSubject.isAllowed(childResource, 'view'));
    }));
    it('Node.getHierarchyIds() should return flattened array of correct ids', () => __awaiter(this, void 0, void 0, function* () {
        const childResource = new classes.PostResource(postA1a);
        expect(yield childResource.getHierarchyIds(), 'Post -> Blog -> Org').to.deep.equal(['p0014', 'b0010', 'o001']);
    }));
    it('Should use displayName if provided in Node.toString()', () => {
        class TestResource extends Resource {
        }
        TestResource.displayName = 'MY_RESOURCE';
        TestResource.repository = new MemoryRepository();
        const node = new TestResource({ id: 1 });
        expect(node.getName()).to.equal(TestResource.displayName);
        expect(node.toString()).to.equal(`<Resource:${TestResource.displayName} id=1>`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhY2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L3NwZWMvZ3JhY2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7T0FDTyxFQUFFLE1BQU0sRUFBRSxNQUFNLE1BQU07T0FDdEIsS0FBSyxPQUFPLE1BQU0sa0JBQWtCO09BQ3BDLEtBQUssT0FBTyxNQUFNLGtCQUFrQjtPQUNwQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUI7QUFFckUsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixJQUFJLElBQVMsRUFDVCxJQUFTLEVBQ1QsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsTUFBVyxFQUNYLE1BQVcsRUFDWCxNQUFXLEVBQ1gsT0FBWSxFQUNaLE9BQVksRUFDWixPQUFZLENBQUM7SUFFakIsTUFBTSxhQUFhLEdBQUc7UUFDcEIsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBR25CLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVyQixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFFLE1BQU0sRUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBRSxDQUFDLENBQUM7UUFDMUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBRSxNQUFNLENBQUUsQ0FBQyxDQUFDO1FBRWxDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9CLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUNoQixPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztZQUMxQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztZQUUxQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUUvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztZQUMv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