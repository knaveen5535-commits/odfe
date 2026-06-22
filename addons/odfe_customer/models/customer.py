from odoo import models, fields, api


class OdFeCustomer(models.Model):
    _name = 'odfe.customer'
    _description = 'Customer Profile'
    _rec_name = 'name'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Customer Name', required=True, tracking=True)
    phone = fields.Char(string='Phone Number', tracking=True)
    email = fields.Char(string='Email')
    address = fields.Text(string='Address')
    city = fields.Char(string='City')
    state = fields.Char(string='State')
    zip_code = fields.Char(string='ZIP Code')
    is_vip = fields.Boolean(string='VIP Customer', default=False)
    loyalty_points = fields.Integer(string='Loyalty Points', default=0, compute='_compute_loyalty_points', store=True)
    total_orders = fields.Integer(string='Total Orders', default=0)
    total_spent = fields.Float(string='Total Spent', default=0.0)
    last_order_date = fields.Datetime(string='Last Order Date')
    notes = fields.Text(string='Notes')

    @api.depends('loyalty_point_ids')
    def _compute_loyalty_points(self):
        for rec in self:
            rec.loyalty_points = sum(rec.loyalty_point_ids.mapped('points'))

    loyalty_point_ids = fields.One2many('odfe.loyalty.point', 'customer_id', string='Loyalty Points')
