from odoo import models, fields, api
import secrets


class OdFeGuestSession(models.Model):
    _name = 'odfe.guest.session'
    _description = 'Guest Self-Order Session'
    _rec_name = 'token'

    token = fields.Char(string='Session Token', required=True, readonly=True, default=lambda self: secrets.token_urlsafe(32))
    table_id = fields.Many2one('odfe.table', string='Table', required=True)
    customer_name = fields.Char(string='Customer Name')
    phone = fields.Char(string='Phone')
    status = fields.Selection([
        ('active', 'Active'),
        ('ordering', 'Ordering'),
        ('completed', 'Completed'),
    ], string='Status', default='active')
    cart_data = fields.Text(string='Cart Data')
    created_order_id = fields.Many2one('odfe.order', string='Created Order')
    start_time = fields.Datetime(string='Start Time', default=fields.Datetime.now)
    end_time = fields.Datetime(string='End Time')

    def create_order_from_cart(self):
        cart = json.loads(self.cart_data) if self.cart_data else {}
        order = self.env['odfe.order'].create({
            'session_id': self.env['odfe.pos.session'].search([], limit=1).id,
            'employee_id': self.env['odfe.employee'].search([], limit=1).id,
            'table_id': self.table_id.id,
            'order_type': 'dine_in',
        })
        for item in cart.get('items', []):
            self.env['odfe.order.line'].create({
                'order_id': order.id,
                'product_id': item['product_id'],
                'qty': item.get('qty', 1),
                'price_unit': item.get('price', 0),
            })
        self.write({'created_order_id': order.id, 'status': 'completed', 'end_time': fields.Datetime.now()})
        return order
