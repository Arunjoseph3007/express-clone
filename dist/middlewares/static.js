"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicFiles = void 0;
const ls_1 = require("../utils/ls");
const publicFiles = (publicDir, basePath = "/") => {
    const allFiles = (0, ls_1.getAllFilesSync)(publicDir).map((f) => "/" + f);
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const urlFilePath = req.url;
        const actualPath = urlFilePath.replace(basePath, publicDir);
        if (allFiles.includes(actualPath)) {
            return res.sendFile(actualPath.slice(1));
        }
        else {
            next();
        }
    });
};
exports.publicFiles = publicFiles;
