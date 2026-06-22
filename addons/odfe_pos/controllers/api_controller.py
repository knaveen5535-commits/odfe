from odoo import http
from odoo.http import request
import json


class OdFePOSApiController(http.Controller):

    @http.route('/api/v1/orders', type='json', auth='user', methods=['GET'])
    def get_orders(self, **kwargs):
        domain = []
        if kwargs.get('status'):
            domain.append(('status', '=', kwargs['status']))
        if kwargs.get('session_id'):
            domain.append(('session_id', '=', int(kwargs['session_id'])))
        orders = request.env['odfe.order'].search(domain)
        return {
            'success': True,
            'data': [{
                'id': o.id,
                'ref': o.order_ref,
                'total': o.total,
                'status': o.status,
                'table': o.table_id.name if o.table_id else None,
                'employee': o.employee_id.name,
                'customer': o.customer_id.name if o.customer_id else None,
                'date': o.order_date.isoformat(),
                'items': [{
                    'product': l.product_id.name,
                    'qty': l.qty,
                    'price': l.price_unit,
                    'subtotal': l.subtotal,
                } for l in o.order_line_ids],
            } for o in orders],
        }

    @http.route('/api/v1/orders', type='json', auth='user', methods=['POST'])
    def create_order(self, **kwargs):
        data = kwargs
        order = request.env['odfe.order'].create({
            'session_id': data.get('session_id'),
            'employee_id': data.get('employee_id'),
            'customer_id': data.get('customer_id'),
            'table_id': data.get('table_id'),
            'order_type': data.get('order_type', 'dine_in'),
            'note': data.get('note', ''),
        })
        for item in data.get('items', []):
            request.env['odfe.order.line'].create({
                'order_id': order.id,
                'product_id': item['product_id'],
                'qty': item.get('qty', 1),
                'price_unit': item.get('price_unit', 0),
                'discount': item.get('discount', 0),
            })
        return {'success': True, 'data': {'id': order.id, 'ref': order.order_ref}}

    @http.route('/api/v1/orders/<int:order_id>/status', type='json', auth='user', methods=['PUT'])
    def update_order_status(self, order_id, **kwargs):
        order = request.env['odfe.order'].browse(order_id)
        if not order.exists():
            return {'success': False, 'error': 'Order not found'}
        status = kwargs.get('status')
        if status == 'confirmed':
            order.action_confirm()
        elif status == 'paid':
            order.action_paid()
        elif status == 'cancelled':
            order.action_cancel()
        else:
            return {'success': False, 'error': 'Invalid status'}
        return {'success': True, 'data': {'id': order.id, 'status': order.status}}
