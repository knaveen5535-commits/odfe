from odoo import models, fields


class OdFeTable(models.Model):
    _name = 'odfe.table'
    _description = 'Restaurant Table'
    _rec_name = 'name'
    _order = 'floor_id, sequence, name'

    name = fields.Char(string='Table Name/Number', required=True)
    floor_id = fields.Many2one('odfe.floor', string='Floor', required=True)
    capacity = fields.Integer(string='Capacity', default=4)
    status = fields.Selection([
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('reserved', 'Reserved'),
        ('cleaning', 'Cleaning'),
        ('unavailable', 'Unavailable'),
    ], string='Status', default='available', tracking=True)
    shape = fields.Selection([
        ('round', 'Round'),
        ('rect', 'Rectangle'),
        ('square', 'Square'),
    ], string='Shape', default='rect')
    pos_x = fields.Integer(string='Position X', default=0)
    pos_y = fields.Integer(string='Position Y', default=0)
    width = fields.Integer(string='Width', default=100)
    height = fields.Integer(string='Height', default=80)
    rotation = fields.Integer(string='Rotation', default=0)
    qr_code = fields.Char(string='QR Code Identifier')
    sequence = fields.Integer(string='Sequence', default=10)
    is_active = fields.Boolean(string='Active', default=True)
    current_order_id = fields.Many2one('odfe.order', string='Current Order')
