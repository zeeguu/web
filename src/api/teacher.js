import { Zeeguu_API } from './classDef'

Zeeguu_API.prototype.isTeacher = function (callback) {
  this._get(`is_teacher`, callback)
}
