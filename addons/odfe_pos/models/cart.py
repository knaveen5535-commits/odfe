from odoo import models, fields, api


class OdFeCart(models.Model):
    _name = 'odfe.cart'
    _description = 'Shopping Cart'

    session_id = fields.Many2one('odfe.pos.session', string='POS Session')
    employee_id = fields.Many2one('odfe.employee', string='Employee')
    customer_id = fields.Many2one('odfe.customer', string='Customer')
    table_id = fields.Many2one('odfe.table', string='Table')
    line_ids = fields.One2many('odfe.cart.line', 'cart_id', string='Cart Lines')
    total = fields.Float(string='Total', compute='_compute_total', store=True)
    tax_amount = fields.Float(string='Tax', compute='_compute_total', store=True)
    item_count = fields.Integer(string='Items', compute='_compute_total', store=True)

    @api.depends('line_ids', 'line_ids.subtotal')
    def _compute_total(self):
        for rec in self:
            lines = rec.line_ids
            rec.total = sum(lines.mapped('subtotal'))
            rec.tax_amount = sum(lines.mapped('tax_amount'))
            rec.item_count = len(lines)

    def add_product(self, product_id, qty=1.0):
        line = self.line_ids.filtered(lambda l: l.product_id.id == product_id)
        if line:
            line.write({'qty': line.qty + qty})
        else:
            self.env['odfe.cart.line'].create({
                'cart_id': self.id,
                'product_id': product_id,
                'qty': qty,
            })
        return True

    def clear_cart(self):
        self.line_ids.unlink()

    def action_create_order(self):
        order = self.env['odfe.order'].create({
            'session_id': self.session_id.id,
            'employee_id': self.employee_id.id or self.session_id.employee_id.id,
            'customer_id': self.customer_id.id,
            'table_id': self.table_id.id,
        })
        for line in self.line_ids:
            self.env['odfe.order.line'].create({
                'order_id': order.id,
                'product_id': line.product_id.id,
                'qty': line.qty,
                'price_unit': line.price_unit,
                'subtotal': line.subtotal,
            })
        self.clear_cart()
        return order


class OdFeCartLine(models.Model):
    _name = 'odfe.cart.line'
    _description = 'Cart Line'

    cart_id = fields.Many2one('odfe.cart', string='Cart', required=True, ondelete='cascade')
    product_id = fields.Many2one('odfe.product', string='Product', required=True)
    qty = fields.Float(string='Quantity', default=1.0)
    price_unit = fields.Float(string='Unit Price', related='product_id.sale_price', store=True)
    subtotal = fields.Float(string='Subtotal', compute='_compute_subtotal', store=True)
    tax_amount = fields.Float(string='Tax Amount', compute='_compute_subtotal', store=True)
    discount = fields.Float(string='Discount %', default=0.0)

    @api.depends('qty', 'price_unit', 'discount')
    def _compute_subtotal(self):
        for rec in self:
            base = rec.qty * rec.price_unit
            disc = base * (rec.discount / 100.0)
            rec.subtotal = base - disc
            rec.tax_amount = rec.subtotal * 0.05
