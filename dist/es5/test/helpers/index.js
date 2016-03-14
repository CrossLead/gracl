"use strict";

var __id = 1;
function uidReset() {
    __id = 1;
}
exports.uidReset = uidReset;
function uid(prefix) {
    return '' + prefix + __id++;
}
exports.uid = uid;
function org() {
    return {
        id: uid('o00')
    };
}
exports.org = org;
function user() {
    var teamIds = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    return {
        id: uid('u00'),
        teamIds: teamIds.map(function (t) {
            return t.id;
        })
    };
}
exports.user = user;
function team(organization) {
    return {
        id: uid('t00'),
        organizationId: organization.id
    };
}
exports.team = team;
function blog(organization) {
    return {
        id: uid('b00'),
        organizationId: organization.id
    };
}
exports.blog = blog;
function post(blogDoc) {
    return {
        id: uid('p00'),
        blogId: blogDoc.id
    };
}
exports.post = post;