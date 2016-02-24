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

export function user(teamIds: any[] = []) {
  return {
    id: uid(),
    teamIds: teamIds.map(t => t.id)
  };
}

export function team(organization: any) {
  return {
    id: uid(),
    organizationId: organization.id
  };
}

export function blog(organization: any) {
  return {
    id: uid(),
    organizationId: organization.id
  };
}

export function post(blogDoc: any) {
  return {
    id: uid(),
    blogId: blogDoc.id
  };
}
