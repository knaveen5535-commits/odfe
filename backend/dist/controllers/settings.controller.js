"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
async function getSettings(_req, res) {
    res.json({
        success: true,
        data: {
            storeName: 'ODFE Cafe',
            currency: 'USD',
            taxRate: 5,
            timezone: 'UTC',
            orderPrefix: 'ORD-',
            lowStockThreshold: 10,
        },
    });
}
async function updateSettings(req, res) {
    res.json({ success: true, data: req.body, message: 'Settings updated' });
}
//# sourceMappingURL=settings.controller.js.map