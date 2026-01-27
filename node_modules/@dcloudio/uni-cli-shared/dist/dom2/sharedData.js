"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniSharedDataPlugin = void 0;
const uts_1 = require("../uts");
const pages_1 = require("../json/pages");
const utils_1 = require("../utils");
const asset_1 = require("../vite/plugins/vitejs/plugins/asset");
function uniSharedDataPlugin() {
    const { USDP } = (0, utils_1.requireUniHelpers)();
    const compiler = require('@dcloudio/compiler-vapor-dom2');
    return USDP({
        compilerVaporDom2: compiler,
        utsCompiler: (0, uts_1.resolveUTSCompiler)(),
        isUniPageFile: pages_1.isUniPageFile,
        getSharedDataResult: compiler.getSharedDataResult,
        getAssetFilenameById: asset_1.getAssetFilenameById,
    });
}
exports.uniSharedDataPlugin = uniSharedDataPlugin;
