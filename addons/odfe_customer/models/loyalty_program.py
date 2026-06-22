from odoo import models, fields


class OdFeLoyaltyPoint(models.Model):
    _name = 'odfe.loyalty.point'
    _description = 'Loyalty Point'

    customer_id = fields.Many2one('odfe.customer', string='Customer', required=True, ondelete='cascade')
    points = fields.Integer(string='Points', required=True)
    reason = fields.Char(string='Reason')
    source = fields.Selection([
        ('purchase', 'Purchase'),
        ('bonus', 'Bonus'),
        ('redemption', 'Redemption'),
    ], string='Source', default='purchase')
    date = fields.Datetime(string='Date', default=fields.Datetime.now)


class OdFeLoyaltyProgram(models.Model):
    _name = 'odfe.loyalty.program'
    _description = 'Loyalty Program Settings'

    name = fields.Char(string='Program Name', required=True)
    points_per_currency = fields.Float(string='Points per Currency', default=1.0)
    redemption_rate = fields.Float(string='Redemption Rate', default=0.01)
    minimum_points = fields.Integer(string='Minimum Points for Redemption', default=100)
    is_active = fields.Boolean(string='Active', default=True)
