"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = templatize;
function templatize() {
  var Template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var Substitutions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var TemplateData = Template;
  if (!TemplateData) {
    return TemplateData;
  }
  var substitutionKeys = Object.keys(Substitutions);
  substitutionKeys.forEach(key => {
    var value = Substitutions[key];
    if (value === undefined || value === null) {
      value = '';
    }
    TemplateData = TemplateData.replaceAll("{{".concat(key, "}}"), value);
  });
  return TemplateData;
}