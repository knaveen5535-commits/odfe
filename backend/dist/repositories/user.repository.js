"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const index_1 = require("../index");
exports.userRepository = {
    findByEmail(email) {
        return index_1.prisma.user.findUnique({ where: { email } });
    },
    findById(id) {
        return index_1.prisma.user.findUnique({ where: { id } });
    },
    create(data) {
        return index_1.prisma.user.create({ data });
    },
};
//# sourceMappingURL=user.repository.js.map