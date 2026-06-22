from odoo import models, fields, api


class OdFeOrderLine(models.Model):
    _name = 'odfe.order.line'
    _description = 'Order Line'

    order_id = fields.Many2one('odfe.order', string='Order', required=True, ondelete='cascade')
    product_id = fields.Many2one('odfe.product', string='Product', required=True)
    qty = fields.Float(string='Quantity', default=1.0)
    price_unit = fields.Float(string='Unit Price')
    discount = fields.Float(string='Discount %', default=0.0)
    subtotal = fields.Float(string='Subtotal', compute='_compute_subtotal', store=True)
    tax_amount = fields.Float(string='Tax Amount', compute='_compute_subtotal', store=True)
    status = fields.Selection([
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('served', 'Served'),
        ('cancelled', 'Cancelled'),
    ], string='Status', default='pending')
    note = fields.Text(string='Note')

    @api.depends('qty', 'price_unit', 'discount')
    def _compute_subtotal(self):
        for rec in self:
            base = rec.qty * rec.price_unit
            disc = base * (rec.discount / 100.0)
            rec.subtotal = base - disc
            rec.tax_amount = rec.subtotal * 0.05
