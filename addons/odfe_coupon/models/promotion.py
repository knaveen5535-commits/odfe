from odoo import models, fields


class OdFePromotion(models.Model):
    _name = 'odfe.promotion'
    _description = 'Promotion'
    _rec_name = 'name'

    name = fields.Char(string='Promotion Name', required=True)
    description = fields.Text(string='Description')
    promo_type = fields.Selection([
        ('buy_x_get_y', 'Buy X Get Y'),
        ('volume_discount', 'Volume Discount'),
        ('happy_hour', 'Happy Hour'),
        ('combo', 'Combo Deal'),
    ], string='Promotion Type', required=True)
    discount_percent = fields.Float(string='Discount Percentage')
    conditions = fields.Text(string='Conditions')
    valid_from = fields.Datetime(string='Valid From')
    valid_until = fields.Datetime(string='Valid Until')
    is_active = fields.Boolean(string='Active', default=True)
    product_ids = fields.Many2many('odfe.product', string='Applicable Products')
