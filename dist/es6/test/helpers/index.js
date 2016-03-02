let __id = 1;
export function uidReset() {
    __id = 1;
}
export function uid() {
    return `uid${__id++}`;
}
export function org() {
    return {
        id: uid()
    };
}
export function user(teamIds = []) {
    return {
        id: uid(),
        teamIds: teamIds.map(t => t.id)
    };
}
export function team(organization) {
    return {
        id: uid(),
        organizationId: organization.id
    };
}
export function blog(organization) {
    return {
        id: uid(),
        organizationId: organization.id
    };
}
export function post(blogDoc) {
    return {
        id: uid(),
        blogId: blogDoc.id
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2hlbHBlcnMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBRWI7SUFDRSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEO0lBQ0UsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUUsQ0FBQztBQUN4QixDQUFDO0FBRUQ7SUFDRSxNQUFNLENBQUM7UUFDTCxFQUFFLEVBQUUsR0FBRyxFQUFFO0tBQ1YsQ0FBQztBQUNKLENBQUM7QUFFRCxxQkFBcUIsT0FBTyxHQUFVLEVBQUU7SUFDdEMsTUFBTSxDQUFDO1FBQ0wsRUFBRSxFQUFFLEdBQUcsRUFBRTtRQUNULE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQ2hDLENBQUM7QUFDSixDQUFDO0FBRUQscUJBQXFCLFlBQWlCO0lBQ3BDLE1BQU0sQ0FBQztRQUNMLEVBQUUsRUFBRSxHQUFHLEVBQUU7UUFDVCxjQUFjLEVBQUUsWUFBWSxDQUFDLEVBQUU7S0FDaEMsQ0FBQztBQUNKLENBQUM7QUFFRCxxQkFBcUIsWUFBaUI7SUFDcEMsTUFBTSxDQUFDO1FBQ0wsRUFBRSxFQUFFLEdBQUcsRUFBRTtRQUNULGNBQWMsRUFBRSxZQUFZLENBQUMsRUFBRTtLQUNoQyxDQUFDO0FBQ0osQ0FBQztBQUVELHFCQUFxQixPQUFZO0lBQy9CLE1BQU0sQ0FBQztRQUNMLEVBQUUsRUFBRSxHQUFHLEVBQUU7UUFDVCxNQUFNLEVBQUUsT0FBTyxDQUFDLEVBQUU7S0FDbkIsQ0FBQztBQUNKLENBQUMifQ==