from odoo import models, fields, api
from odoo.exceptions import ValidationError


class OdFeKitchenOrder(models.Model):
    _name = 'odfe.kitchen.order'
    _description = 'Kitchen Order'
    _rec_name = 'display_name'
    _order = 'create_date desc'

    display_name = fields.Char(string='Display Name', compute='_compute_display_name', store=True)
    order_id = fields.Many2one('odfe.order', string='Source Order', required=True, ondelete='cascade')
    table_name = fields.Char(string='Table', related='order_id.table_id.name', store=True)
    priority = fields.Selection([
        ('normal', 'Normal'),
        ('urgent', 'Urgent'),
    ], string='Priority', default='normal')
    status = fields.Selection([
        ('new', 'New'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('served', 'Served'),
        ('cancelled', 'Cancelled'),
    ], string='Status', default='new', tracking=True)
    note = fields.Text(string='Note')
    item_ids = fields.One2many('odfe.kitchen.item', 'kitchen_order_id', string='Items')
    item_count = fields.Integer(string='Item Count', compute='_compute_item_count', store=True)

    @api.depends('order_id', 'order_id.order_ref')
    def _compute_display_name(self):
        for rec in self:
            rec.display_name = f"K-{rec.order_id.order_ref or 'N/A'}"

    @api.depends('item_ids')
    def _compute_item_count(self):
        for rec in self:
            rec.item_count = len(rec.item_ids)

    def action_prepare(self):
        self.write({'status': 'preparing'})

    def action_ready(self):
        self.write({'status': 'ready'})

    def action_serve(self):
        self.write({'status': 'served'})

    def action_cancel(self):
        self.write({'status': 'cancelled'})

    @api.constrains('status')
    def _check_status_transition(self):
        valid = {
            'new': ['preparing', 'cancelled'],
            'preparing': ['ready', 'cancelled'],
            'ready': ['served'],
        }
        for rec in self:
            if rec._origin and rec._origin.status in valid:
                if rec.status not in valid[rec._origin.status]:
                    raise ValidationError(f'Invalid status transition from {rec._origin.status} to {rec.status}')
