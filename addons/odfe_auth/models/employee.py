from odoo import models, fields, api
from odoo.exceptions import ValidationError
import re


class OdFeEmployee(models.Model):
    _name = 'odfe.employee'
    _description = 'Cafe Employee'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _rec_name = 'name'

    name = fields.Char(string='Employee Name', required=True, tracking=True)
    employee_code = fields.Char(string='Employee Code', required=True, copy=False, readonly=True)
    user_id = fields.Many2one('res.users', string='Related User', ondelete='cascade')
    role_id = fields.Many2one('odfe.role', string='Role', required=True, tracking=True)
    phone = fields.Char(string='Phone Number')
    email = fields.Char(string='Email')
    pin_code = fields.Char(string='PIN Code', size=6)
    is_active = fields.Boolean(string='Active', default=True)
    join_date = fields.Date(string='Join Date', default=fields.Date.today)
    avatar = fields.Binary(string='Avatar')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if not vals.get('employee_code'):
                vals['employee_code'] = self.env['ir.sequence'].next_by_code('odfe.employee')
        return super().create(vals_list)

    @api.constrains('pin_code')
    def _check_pin_code(self):
        for rec in self:
            if rec.pin_code and not re.match(r'^\d{4,6}$', rec.pin_code):
                raise ValidationError('PIN code must be 4 to 6 digits.')
