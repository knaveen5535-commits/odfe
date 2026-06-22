from odoo import models, fields, api
import secrets


class OdFeSelfOrderToken(models.Model):
    _name = 'odfe.self.order.token'
    _description = 'Self-Order Token'
    _rec_name = 'token'

    token = fields.Char(string='Token', required=True, readonly=True, default=lambda self: secrets.token_urlsafe(16))
    table_id = fields.Many2one('odfe.table', string='Table', required=True)
    is_active = fields.Boolean(string='Active', default=True)
    expiry = fields.Datetime(string='Expiry')
    create_date = fields.Datetime(string='Created', default=fields.Datetime.now)
