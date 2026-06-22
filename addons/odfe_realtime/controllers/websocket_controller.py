from odoo import http
from odoo.http import request
import json


class OdFeWebSocketController(http.Controller):

    @http.route('/ws', type='http', auth='user', cors='*', websocket=True)
    def websocket_handler(self):
        # WebSocket upgrade handled by Odoo's bus
        return "WebSocket endpoint"

    @http.route('/api/v1/notifications', type='json', auth='user', methods=['GET'])
    def get_notifications(self, **kwargs):
        notifications = request.env['odfe.notification'].search([
            ('user_id', '=', request.env.uid),
            ('is_read', '=', False),
        ], order='create_date desc', limit=50)
        return {
            'success': True,
            'data': [{
                'id': n.id,
                'title': n.title,
                'message': n.message,
                'type': n.notif_type,
                'date': n.create_date.isoformat(),
            } for n in notifications],
        }

    @http.route('/api/v1/notifications/<int:notif_id>/read', type='json', auth='user', methods=['POST'])
    def mark_notification_read(self, notif_id, **kwargs):
        notif = request.env['odfe.notification'].browse(notif_id)
        if notif.exists():
            notif.mark_read()
            return {'success': True}
        return {'success': False, 'error': 'Notification not found'}
