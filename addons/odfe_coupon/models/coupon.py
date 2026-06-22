from odoo import models, fields, api
from odoo.exceptions import ValidationError
from datetime import datetime


class OdFeCoupon(models.Model):
    _name = 'odfe.coupon'
    _description = 'Coupon'
    _rec_name = 'code'

    code = fields.Char(string='Coupon Code', required=True, unique=True)
    description = fields.Text(string='Description')
    discount_type = fields.Selection([
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ], string='Discount Type', required=True, default='percentage')
    discount_value = fields.Float(string='Discount Value', required=True)
    minimum_order = fields.Float(string='Minimum Order Amount', default=0.0)
    maximum_discount = fields.Float(string='Maximum Discount Amount')
    valid_from = fields.Datetime(string='Valid From', required=True)
    valid_until = fields.Datetime(string='Valid Until', required=True)
    usage_limit = fields.Integer(string='Usage Limit', default=0)
    usage_count = fields.Integer(string='Usage Count', default=0)
    is_active = fields.Boolean(string='Active', default=True)

    @api.constrains('valid_from', 'valid_until')
    def _check_dates(self):
        for rec in self:
            if rec.valid_from and rec.valid_until and rec.valid_from >= rec.valid_until:
                raise ValidationError('Valid From must be before Valid Until.')

    def is_valid(self, order_total=0.0):
        self.ensure_one()
        now = datetime.now()
        if not self.is_active:
            return False
        if now < self.valid_from or now > self.valid_until:
            return False
        if self.usage_limit > 0 and self.usage_count >= self.usage_limit:
            return False
        if order_total < self.minimum_order:
            return False
        return True

    def compute_discount(self, order_total):
        self.ensure_one()
        if self.discount_type == 'percentage':
            amount = order_total * (self.discount_value / 100.0)
            if self.maximum_discount > 0:
                amount = min(amount, self.maximum_discount)
            return amount
        else:
            return min(self.discount_value, order_total)
