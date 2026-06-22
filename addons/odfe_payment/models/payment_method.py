from odoo import models, fields


class OdFePaymentMethod(models.Model):
    _name = 'odfe.payment.method'
    _description = 'Payment Method'
    _rec_name = 'name'

    name = fields.Char(string='Method Name', required=True)
    code = fields.Char(string='Method Code', required=True)
    method_type = fields.Selection([
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('qr', 'QR Code'),
        ('other', 'Other'),
    ], string='Type', required=True)
    is_active = fields.Boolean(string='Active', default=True)
    sequence = fields.Integer(string='Sequence', default=10)
    description = fields.Text(string='Description')
