from odoo import models, fields


class OdFeTax(models.Model):
    _name = 'odfe.tax'
    _description = 'Tax'
    _rec_name = 'name'

    name = fields.Char(string='Tax Name', required=True)
    rate = fields.Float(string='Tax Rate (%)', required=True, default=5.0)
    is_active = fields.Boolean(string='Active', default=True)
    type = fields.Selection([
        ('inclusive', 'Inclusive'),
        ('exclusive', 'Exclusive'),
    ], string='Type', default='exclusive')
