from odoo import models, fields, api
import json


class OdFeSync(models.Model):
    _name = 'odfe.sync'
    _description = 'Data Sync Record'

    model = fields.Char(string='Model', required=True)
    res_id = fields.Integer(string='Record ID')
    action = fields.Selection([
        ('create', 'Create'),
        ('write', 'Write'),
        ('unlink', 'Delete'),
    ], string='Action', required=True)
    data = fields.Text(string='Sync Data')
    state = fields.Selection([
        ('pending', 'Pending'),
        ('synced', 'Synced'),
        ('failed', 'Failed'),
    ], string='State', default='pending')
    create_date = fields.Datetime(string='Created', default=fields.Datetime.now)

    @api.model
    def push_sync(self, model, res_id, action, data=None):
        return self.create({
            'model': model,
            'res_id': res_id,
            'action': action,
            'data': json.dumps(data) if data else None,
        })

    def mark_synced(self):
        self.write({'state': 'synced'})

    def mark_failed(self):
        self.write({'state': 'failed'})
