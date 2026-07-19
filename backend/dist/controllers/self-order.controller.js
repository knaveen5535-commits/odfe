"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOnlineOrder = exports.getQRCodes = void 0;
const getQRCodes = async (req, res) => {
    res.json({ success: true, data: [] });
};
exports.getQRCodes = getQRCodes;
const placeOnlineOrder = async (req, res) => {
    res.json({ success: true, data: {} });
};
exports.placeOnlineOrder = placeOnlineOrder;
//# sourceMappingURL=self-order.controller.js.map