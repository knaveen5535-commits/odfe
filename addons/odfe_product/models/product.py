from odoo import models, fields, api


class OdFeProduct(models.Model):
    _name = 'odfe.product'
    _description = 'Product'
    _rec_name = 'name'
    _order = 'sequence, name'

    name = fields.Char(string='Product Name', required=True)
    barcode = fields.Char(string='Barcode')
    category_id = fields.Many2one('odfe.product.category', string='Category', required=True)
    uom_id = fields.Many2one('odfe.uom', string='Unit of Measure', required=True)
    sale_price = fields.Float(string='Sale Price', required=True, default=0.0)
    cost_price = fields.Float(string='Cost Price', default=0.0)
    tax_id = fields.Many2one('odfe.tax', string='Tax')
    image = fields.Binary(string='Image')
    is_active = fields.Boolean(string='Active', default=True)
    is_available = fields.Boolean(string='Available', default=True)
    is_combo = fields.Boolean(string='Is Combo', default=False)
    sequence = fields.Integer(string='Sequence', default=10)
    description = fields.Text(string='Description')
    preparation_time = fields.Integer(string='Preparation Time (min)', default=5)
    kitchen_category = fields.Selection([
        ('main', 'Main Course'),
        ('starter', 'Starter'),
        ('dessert', 'Dessert'),
        ('beverage', 'Beverage'),
    ], string='Kitchen Category', default='main')
    ingredient_ids = fields.One2many('odfe.product.ingredient', 'product_id', string='Ingredients')
    modifier_ids = fields.One2many('odfe.product.modifier', 'product_id', string='Modifiers')
