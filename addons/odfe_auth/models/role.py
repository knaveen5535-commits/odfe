from odoo import models, fields


class OdFeRole(models.Model):
    _name = 'odfe.role'
    _description = 'Employee Role'
    _rec_name = 'name'

    name = fields.Char(string='Role Name', required=True)
    code = fields.Char(string='Role Code', required=True)
    description = fields.Text(string='Description')
    is_admin = fields.Boolean(string='Is Admin', default=False)
    is_cashier = fields.Boolean(string='Is Cashier', default=False)
    is_waiter = fields.Boolean(string='Is Waiter', default=False)
    is_kitchen = fields.Boolean(string='Is Kitchen Staff', default=False)
    permission_ids = fields.One2many('odfe.role.permission', 'role_id', string='Permissions')
