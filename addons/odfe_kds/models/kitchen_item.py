from odoo import models, fields


class OdFeKitchenItem(models.Model):
    _name = 'odfe.kitchen.item'
    _description = 'Kitchen Order Item'

    kitchen_order_id = fields.Many2one('odfe.kitchen.order', string='Kitchen Order', required=True, ondelete='cascade')
    product_id = fields.Many2one('odfe.product', string='Product', required=True)
    product_name = fields.Char(string='Product Name', related='product_id.name', store=True)
    qty = fields.Float(string='Quantity', required=True, default=1.0)
    status = fields.Selection([
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('served', 'Served'),
        ('cancelled', 'Cancelled'),
    ], string='Status', default='pending')
    note = fields.Char(string='Note')
