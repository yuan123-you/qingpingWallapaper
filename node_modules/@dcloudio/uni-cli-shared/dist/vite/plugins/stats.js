"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniStatsPlugin = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_1 = require("../../utils");
const json_1 = require("../../json");
const messages_1 = require("../../messages");
const emittedHashMap = new WeakMap();
function uniStatsPlugin() {
    let resolvedConfig;
    let isManifestChanged = false;
    const shouldTrackManifestChange = process.env.UNI_APP_X === 'true' &&
        process.env.UNI_PLATFORM === 'app-harmony';
    let isVapor = shouldTrackManifestChange && process.env.UNI_APP_X_DOM2 === 'true';
    return {
        name: 'uni:app-stats',
        enforce: 'post',
        configResolved(config) {
            resolvedConfig = config;
            emittedHashMap.set(resolvedConfig, new Map());
        },
        watchChange(id) {
            if (shouldTrackManifestChange && id.endsWith('manifest.json')) {
                isManifestChanged = true;
                try {
                    const manifest = (0, json_1.parseJson)(fs_extra_1.default.readFileSync(id, 'utf-8'), true, 'manifest.json');
                    const uniAppX = manifest['uni-app-x'] || {};
                    if (uniAppX.vapor !== isVapor) {
                        isVapor = uniAppX.vapor === true;
                        console.warn(messages_1.M['dev.watching.restart.vapor']);
                    }
                }
                catch (e) { }
            }
        },
        writeBundle(_, bundle) {
            if (resolvedConfig.isProduction) {
                // 仅dev生效
                return;
            }
            const emittedHash = emittedHashMap.get(resolvedConfig);
            const changedFiles = [];
            Object.keys(bundle).forEach((filename) => {
                // 不处理sourcemap
                if (filename.endsWith('.map')) {
                    return;
                }
                const outputFile = bundle[filename];
                let outputFileHash = '';
                if (outputFile.type === 'asset') {
                    outputFileHash = (0, utils_1.hash)(outputFile.source);
                }
                else {
                    outputFileHash = (0, utils_1.hash)(outputFile.code);
                }
                if (emittedHash.get(filename) !== outputFileHash) {
                    emittedHash.set(filename, outputFileHash);
                    changedFiles.push(filename);
                }
            });
            if (isManifestChanged) {
                isManifestChanged = false;
                changedFiles.unshift('manifest.json');
            }
            process.env.UNI_APP_CHANGED_FILES = changedFiles.length
                ? JSON.stringify(changedFiles)
                : '';
        },
    };
}
exports.uniStatsPlugin = uniStatsPlugin;
