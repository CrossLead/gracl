let __id = 1;

export function uidReset() {
  __id = 1;
}

export function uid(prefix: string) {
  return `${prefix}${__id++}`;
}

export function org() {
  return {
    id: uid('o00')
  };
}

export function user(teamIds: any[] = []) {
  return {
    id: uid('u00'),
    teamIds: teamIds.map(t => t.id)
  };
}

export function team(organization: any) {
  return {
    id: uid('t00'),
    organizationId: organization.id
  };
}

export function blog(organization: any) {
  return {
    id: uid('b00'),
    organizationId: organization.id
  };
}

export function post(blogDoc: any) {
  return {
    id: uid('p00'),
    blogId: blogDoc.id
  };
}
