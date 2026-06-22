from odoo import models, fields, api
from odoo.exceptions import ValidationError


class OdFeOrder(models.Model):
    _name = 'odfe.order'
    _description = 'POS Order'
    _rec_name = 'order_ref'
    _order = 'order_date desc, id desc'

    order_ref = fields.Char(string='Order Reference', required=True, copy=False, readonly=True)
    session_id = fields.Many2one('odfe.pos.session', string='POS Session', required=True)
    employee_id = fields.Many2one('odfe.employee', string='Employee', required=True)
    customer_id = fields.Many2one('odfe.customer', string='Customer')
    table_id = fields.Many2one('odfe.table', string='Table')
    order_date = fields.Datetime(string='Order Date', default=fields.Datetime.now)
    status = fields.Selection([
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('served', 'Served'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ], string='Status', default='draft', tracking=True)
    order_line_ids = fields.One2many('odfe.order.line', 'order_id', string='Order Lines')
    payment_ids = fields.One2many('odfe.payment', 'order_id', string='Payments')
    total = fields.Float(string='Total', compute='_compute_totals', store=True)
    total_tax = fields.Float(string='Total Tax', compute='_compute_totals', store=True)
    item_count = fields.Integer(string='Item Count', compute='_compute_totals', store=True)
    note = fields.Text(string='Order Note')
    order_type = fields.Selection([
        ('dine_in', 'Dine In'),
        ('takeaway', 'Takeaway'),
        ('delivery', 'Delivery'),
    ], string='Order Type', default='dine_in')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if not vals.get('order_ref'):
                vals['order_ref'] = self.env['ir.sequence'].next_by_code('odfe.order')
        return super().create(vals_list)

    @api.depends('order_line_ids', 'order_line_ids.subtotal')
    def _compute_totals(self):
        for rec in self:
            lines = rec.order_line_ids
            rec.total = sum(lines.mapped('subtotal'))
            rec.total_tax = sum(lines.mapped('tax_amount'))
            rec.item_count = len(lines)

    def action_confirm(self):
        self.write({'status': 'confirmed'})
        self._create_kitchen_order()

    def action_paid(self):
        self.write({'status': 'paid'})

    def action_cancel(self):
        self.write({'status': 'cancelled'})

    def _create_kitchen_order(self):
        kitchen = self.env['odfe.kitchen.order'].create({
            'order_id': self.id,
        })
        for line in self.order_line_ids:
            self.env['odfe.kitchen.item'].create({
                'kitchen_order_id': kitchen.id,
                'product_id': line.product_id.id,
                'qty': line.qty,
                'note': line.note or '',
            })
