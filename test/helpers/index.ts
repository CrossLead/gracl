let __id = 1;

export function uid() {
  return `uid${__id++}`;
}

export function org() {
  return {
    id: uid()
  }
}

export function user(teamIds) {
  return {
    id: uid(),
    teamIds
  }
}

export function team(organizationId) {
  return {
    id: uid(),
    organizationId
  }
}

export function blog(organizationId) {
  return {
    id: uid(),
    organizationId
  }
}

export function post(blogId) {
  return {
    id: uid(),
    blogId
  }
}
