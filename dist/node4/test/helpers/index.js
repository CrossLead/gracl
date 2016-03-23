'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.uidReset = uidReset;
exports.uid = uid;
exports.org = org;
exports.user = user;
exports.team = team;
exports.blog = blog;
exports.post = post;
let __id = 1;
function uidReset() {
    __id = 1;
}
function uid(prefix) {
    return `${ prefix }${ __id++ }`;
}
function org() {
    return {
        id: uid('o00')
    };
}
function user() {
    let teamIds = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    return {
        id: uid('u00'),
        teamIds: teamIds.map(t => t.id)
    };
}
function team(organization) {
    return {
        id: uid('t00'),
        organizationId: organization.id
    };
}
function blog(organization) {
    return {
        id: uid('b00'),
        organizationId: organization.id
    };
}
function post(blogDoc) {
    return {
        id: uid('p00'),
        blogId: blogDoc.id
    };
}