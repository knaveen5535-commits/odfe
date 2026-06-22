from odoo import models, fields, api


class OdFeBaseMixin(models.AbstractModel):
    _name = 'odfe.base.mixin'
    _description = 'ODFE Base Mixin'

    company_id = fields.Many2one('res.company', string='Company', default=lambda self: self.env.company)
    active = fields.Boolean(string='Active', default=True)
    sequence = fields.Integer(string='Sequence', default=10)

    @api.model
    def _get_default_sequence(self):
        return 10
