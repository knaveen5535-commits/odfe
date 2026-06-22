from odoo import models, fields


class OdFeUOM(models.Model):
    _name = 'odfe.uom'
    _description = 'Unit of Measure'
    _rec_name = 'name'

    name = fields.Char(string='UOM Name', required=True)
    code = fields.Char(string='Code', required=True)
    category = fields.Selection([
        ('unit', 'Unit'),
        ('weight', 'Weight'),
        ('volume', 'Volume'),
    ], string='Category', default='unit')
