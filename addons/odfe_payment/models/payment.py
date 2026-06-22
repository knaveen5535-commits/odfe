from odoo import models, fields, api


class OdFePayment(models.Model):
    _name = 'odfe.payment'
    _description = 'Payment'
    _rec_name = 'payment_ref'
    _order = 'payment_date desc'

    payment_ref = fields.Char(string='Payment Reference', required=True, copy=False, readonly=True)
    order_id = fields.Many2one('odfe.order', string='Order', required=True, ondelete='cascade')
    method_id = fields.Many2one('odfe.payment.method', string='Payment Method', required=True)
    amount = fields.Float(string='Amount', required=True)
    tip_amount = fields.Float(string='Tip Amount', default=0.0)
    change_amount = fields.Float(string='Change Amount', default=0.0)
    payment_date = fields.Datetime(string='Payment Date', default=fields.Datetime.now)
    status = fields.Selection([
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ], string='Status', default='pending', tracking=True)
    reference = fields.Char(string='External Reference')
    notes = fields.Text(string='Notes')
    session_id = fields.Many2one('odfe.pos.session', string='POS Session', related='order_id.session_id', store=True)

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if not vals.get('payment_ref'):
                vals['payment_ref'] = self.env['ir.sequence'].next_by_code('odfe.payment')
        return super().create(vals_list)

    def action_complete(self):
        self.write({'status': 'completed'})

    def action_fail(self):
        self.write({'status': 'failed'})

    def action_refund(self):
        self.write({'status': 'refunded'})
