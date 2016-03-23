let __id = 1;
export function uidReset() {
    __id = 1;
}
export function uid(prefix) {
    return `${prefix}${__id++}`;
}
export function org() {
    return {
        id: uid('o00')
    };
}
export function user(teamIds = []) {
    return {
        id: uid('u00'),
        teamIds: teamIds.map(t => t.id)
    };
}
export function team(organization) {
    return {
        id: uid('t00'),
        organizationId: organization.id
    };
}
export function blog(organization) {
    return {
        id: uid('b00'),
        organizationId: organization.id
    };
}
export function post(blogDoc) {
    return {
        id: uid('p00'),
        blogId: blogDoc.id
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2hlbHBlcnMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBRWI7SUFDRSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVELG9CQUFvQixNQUFjO0lBQ2hDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDO0FBQzlCLENBQUM7QUFFRDtJQUNFLE1BQU0sQ0FBQztRQUNMLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDO0tBQ2YsQ0FBQztBQUNKLENBQUM7QUFFRCxxQkFBcUIsT0FBTyxHQUFVLEVBQUU7SUFDdEMsTUFBTSxDQUFDO1FBQ0wsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDZCxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztLQUNoQyxDQUFDO0FBQ0osQ0FBQztBQUVELHFCQUFxQixZQUFpQjtJQUNwQyxNQUFNLENBQUM7UUFDTCxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNkLGNBQWMsRUFBRSxZQUFZLENBQUMsRUFBRTtLQUNoQyxDQUFDO0FBQ0osQ0FBQztBQUVELHFCQUFxQixZQUFpQjtJQUNwQyxNQUFNLENBQUM7UUFDTCxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNkLGNBQWMsRUFBRSxZQUFZLENBQUMsRUFBRTtLQUNoQyxDQUFDO0FBQ0osQ0FBQztBQUVELHFCQUFxQixPQUFZO0lBQy9CLE1BQU0sQ0FBQztRQUNMLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ2QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFO0tBQ25CLENBQUM7QUFDSixDQUFDIn0=