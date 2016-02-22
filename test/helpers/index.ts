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
