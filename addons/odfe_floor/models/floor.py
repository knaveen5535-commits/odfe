from odoo import models, fields


class OdFeFloor(models.Model):
    _name = 'odfe.floor'
    _description = 'Floor Plan'
    _rec_name = 'name'
    _order = 'sequence, name'

    name = fields.Char(string='Floor Name', required=True)
    code = fields.Char(string='Floor Code')
    sequence = fields.Integer(string='Sequence', default=10)
    is_active = fields.Boolean(string='Active', default=True)
    table_ids = fields.One2many('odfe.table', 'floor_id', string='Tables')
    description = fields.Text(string='Description')
