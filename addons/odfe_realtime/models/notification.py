from odoo import models, fields, api


class OdFeNotification(models.Model):
    _name = 'odfe.notification'
    _description = 'Real-time Notification'

    title = fields.Char(string='Title', required=True)
    message = fields.Text(string='Message')
    notif_type = fields.Selection([
        ('order', 'New Order'),
        ('payment', 'Payment'),
        ('kitchen', 'Kitchen'),
        ('system', 'System'),
    ], string='Type', required=True, default='system')
    user_id = fields.Many2one('res.users', string='Target User')
    is_read = fields.Boolean(string='Read', default=False)
    source_model = fields.Char(string='Source Model')
    source_id = fields.Integer(string='Source ID')
    create_date = fields.Datetime(string='Created', default=fields.Datetime.now)

    @api.model
    def send_notification(self, title, message, notif_type='system', user_id=None, source_model=None, source_id=None):
        notif = self.create({
            'title': title,
            'message': message,
            'notif_type': notif_type,
            'user_id': user_id,
            'source_model': source_model,
            'source_id': source_id,
        })
        if user_id:
            self.env['bus.bus']._sendone(
                self.env['res.users'].browse(user_id).partner_id,
                'odfe.notification',
                {'id': notif.id, 'title': title, 'message': message, 'type': notif_type}
            )
        else:
            self.env['bus.bus']._sendone(
                self.env.user.partner_id,
                'odfe.notification',
                {'id': notif.id, 'title': title, 'message': message, 'type': notif_type}
            )
        return notif

    def mark_read(self):
        self.write({'is_read': True})
