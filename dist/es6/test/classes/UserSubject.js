"use strict";
const index_1 = require('../../lib/index');
const TeamSubject_1 = require('./TeamSubject');
exports.userModel = new index_1.MemoryRepository();
class UserSubject extends TeamSubject_1.TeamSubject {
}
UserSubject.repository = exports.userModel;
UserSubject.parentId = 'teamIds';
exports.UserSubject = UserSubject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclN1YmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NsYXNzZXMvVXNlclN1YmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdCQUF5QyxpQkFBaUIsQ0FBQyxDQUFBO0FBQzNELDhCQUE0QixlQUFlLENBQUMsQ0FBQTtBQUUvQixpQkFBUyxHQUFHLElBQUksd0JBQUksRUFBRSxDQUFDO0FBRXBDLDBCQUFpQyx5QkFBVztBQUc1QyxDQUFDO0FBRlEsc0JBQVUsR0FBRyxpQkFBUyxDQUFDO0FBQ3ZCLG9CQUFRLEdBQUcsU0FBUyxDQUFDO0FBRmpCLG1CQUFXLGNBR3ZCLENBQUEifQ==