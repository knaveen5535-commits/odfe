from odoo import models, fields, api


class OdFeReceipt(models.Model):
    _name = 'odfe.receipt'
    _description = 'Order Receipt'
    _rec_name = 'receipt_ref'

    receipt_ref = fields.Char(string='Receipt Number', required=True, copy=False, readonly=True)
    order_id = fields.Many2one('odfe.order', string='Order', required=True, ondelete='cascade')
    receipt_date = fields.Datetime(string='Date', default=fields.Datetime.now)
    receipt_data = fields.Text(string='Receipt Data')
    printed = fields.Boolean(string='Printed', default=False)
    receipt_type = fields.Selection([
        ('order', 'Order Receipt'),
        ('payment', 'Payment Receipt'),
        ('refund', 'Refund Receipt'),
    ], string='Type', default='order')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if not vals.get('receipt_ref'):
                vals['receipt_ref'] = self.env['ir.sequence'].next_by_code('odfe.receipt')
        return super().create(vals_list)

    def generate_receipt_data(self):
        self.ensure_one()
        order = self.order_id
        lines_html = ''
        for line in order.order_line_ids:
            lines_html += f'{line.product_id.name} x{line.qty} @ ${line.price_unit:.2f} = ${line.subtotal:.2f}\n'
        self.receipt_data = (
            f'ODFE Cafe POS\n'
            f'Order: {order.order_ref}\n'
            f'Date: {order.order_date}\n'
            f'{"=" * 30}\n'
            f'{lines_html}\n'
            f'{"=" * 30}\n'
            f'Total: ${order.total:.2f}\n'
            f'Thank you for visiting!'
        )
        return self.receipt_data
