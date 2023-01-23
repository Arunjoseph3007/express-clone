"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodType = exports.HandlerType = void 0;
var HandlerType;
(function (HandlerType) {
    HandlerType[HandlerType["endpoint"] = 0] = "endpoint";
    HandlerType[HandlerType["middleware"] = 1] = "middleware";
})(HandlerType = exports.HandlerType || (exports.HandlerType = {}));
var MethodType;
(function (MethodType) {
    MethodType["GET"] = "GET";
    MethodType["PUT"] = "PUT";
    MethodType["PATCH"] = "PATCH";
    MethodType["POST"] = "POST";
    MethodType["DELETE"] = "DELETE";
    MethodType["ALL"] = "ALL";
})(MethodType = exports.MethodType || (exports.MethodType = {}));
