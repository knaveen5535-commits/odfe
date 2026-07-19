"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSession = exports.createSession = exports.getSessions = void 0;
const getSessions = async (req, res) => {
    res.json({ success: true, data: [] });
};
exports.getSessions = getSessions;
const createSession = async (req, res) => {
    res.json({ success: true, data: {} });
};
exports.createSession = createSession;
const updateSession = async (req, res) => {
    res.json({ success: true, data: {} });
};
exports.updateSession = updateSession;
//# sourceMappingURL=session.controller.js.map