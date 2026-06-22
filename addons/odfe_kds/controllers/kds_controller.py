from odoo import http
from odoo.http import request
import json


class OdFeKDSController(http.Controller):

    @http.route('/odfe/kitchen', type='http', auth='user', website=True)
    def kitchen_dashboard(self, **kwargs):
        orders = request.env['odfe.kitchen.order'].search([('status', 'in', ['new', 'preparing'])])
        return request.render('odfe_kds.kds_dashboard', {'orders': orders})

    @http.route('/api/v1/kds/orders', type='json', auth='user', methods=['GET'])
    def get_orders(self, **kwargs):
        domain = [('status', 'in', ['new', 'preparing', 'ready'])]
        orders = request.env['odfe.kitchen.order'].search(domain)
        return {
            'success': True,
            'data': [{
                'id': o.id,
                'display_name': o.display_name,
                'table_name': o.table_name,
                'status': o.status,
                'priority': o.priority,
                'items': [{
                    'id': i.id,
                    'product': i.product_name,
                    'qty': i.qty,
                    'status': i.status,
                    'note': i.note,
                } for i in o.item_ids],
            } for o in orders],
        }

    @http.route('/api/v1/kds/orders/<int:order_id>/status', type='json', auth='user', methods=['POST'])
    def update_order_status(self, order_id, **kwargs):
        order = request.env['odfe.kitchen.order'].browse(order_id)
        if not order.exists():
            return {'success': False, 'error': 'Order not found'}
        status = kwargs.get('status')
        if status == 'preparing':
            order.action_prepare()
        elif status == 'ready':
            order.action_ready()
        elif status == 'served':
            order.action_serve()
        elif status == 'cancelled':
            order.action_cancel()
        else:
            return {'success': False, 'error': 'Invalid status'}
        return {'success': True, 'data': {'id': order.id, 'status': order.status}}
