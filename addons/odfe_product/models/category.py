from odoo import models, fields


class OdFeProductCategory(models.Model):
    _name = 'odfe.product.category'
    _description = 'Product Category'
    _rec_name = 'name'
    _order = 'sequence, name'

    name = fields.Char(string='Category Name', required=True)
    parent_id = fields.Many2one('odfe.product.category', string='Parent Category')
    sequence = fields.Integer(string='Sequence', default=10)
    is_active = fields.Boolean(string='Active', default=True)
    image = fields.Binary(string='Image')
    color = fields.Integer(string='Color Index')
