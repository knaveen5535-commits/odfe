from odoo import models, fields, api


class ResUsers(models.Model):
    _inherit = 'res.users'

    employee_id = fields.Many2one('odfe.employee', string='Related Employee', ondelete='set null')
    cafe_role_ids = fields.Many2many('odfe.role', string='Cafe Roles', related='employee_id.role_id')

    def _get_cafe_role_code(self):
        self.ensure_one()
        return self.employee_id.role_id.code if self.employee_id else None
