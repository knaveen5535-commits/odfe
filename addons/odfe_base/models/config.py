from odoo import models, fields


class OdFeConfig(models.Model):
    _name = 'odfe.config'
    _description = 'ODFE Configuration'
    _rec_name = 'key'

    key = fields.Char(string='Key', required=True)
    value = fields.Char(string='Value', required=True)
    description = fields.Text(string='Description')
