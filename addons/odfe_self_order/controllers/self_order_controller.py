from odoo import http
from odoo.http import request
import json


class OdFeSelfOrderController(http.Controller):

    @http.route('/odfe/self-order/<string:token>', type='http', auth='public', website=True)
    def self_order_page(self, token, **kwargs):
        session = request.env['odfe.guest.session'].sudo().search([('token', '=', token)], limit=1)
        if not session:
            return request.not_found()
        products = request.env['odfe.product'].sudo().search([('is_available', '=', True)])
        categories = request.env['odfe.product.category'].sudo().search([])
        return request.render('odfe_self_order.self_order_page', {
            'session': session,
            'products': products,
            'categories': categories,
        })

    @http.route('/api/v1/self-order/menu', type='json', auth='public', methods=['GET'])
    def get_menu(self, **kwargs):
        products = request.env['odfe.product'].sudo().search([('is_available', '=', True)])
        categories = request.env['odfe.product.category'].sudo().search([])
        return {
            'success': True,
            'data': {
                'categories': [{'id': c.id, 'name': c.name} for c in categories],
                'products': [{
                    'id': p.id,
                    'name': p.name,
                    'price': p.sale_price,
                    'category_id': p.category_id.id,
                    'description': p.description,
                } for p in products],
            }
        }

    @http.route('/api/v1/self-order/session', type='json', auth='public', methods=['POST'])
    def create_session(self, **kwargs):
        table_id = kwargs.get('table_id')
        table = request.env['odfe.table'].sudo().browse(table_id)
        if not table.exists():
            return {'success': False, 'error': 'Table not found'}
        session = request.env['odfe.guest.session'].sudo().create({
            'table_id': table_id,
            'customer_name': kwargs.get('customer_name', 'Guest'),
        })
        return {
            'success': True,
            'data': {
                'token': session.token,
                'table': table.name,
            }
        }

    @http.route('/api/v1/self-order/place-order', type='json', auth='public', methods=['POST'])
    def place_order(self, **kwargs):
        token = kwargs.get('token')
        session = request.env['odfe.guest.session'].sudo().search([('token', '=', token)], limit=1)
        if not session:
            return {'success': False, 'error': 'Invalid session'}
        items = kwargs.get('items', [])
        order = request.env['odfe.order'].sudo().create({
            'table_id': session.table_id.id,
            'order_type': 'dine_in',
            'employee_id': request.env.ref('odfe_auth.role_waiter').employee_ids[:1].id or False,
        })
        for item in items:
            request.env['odfe.order.line'].sudo().create({
                'order_id': order.id,
                'product_id': item['product_id'],
                'qty': item.get('qty', 1),
                'price_unit': item.get('price', 0),
            })
        order.action_confirm()
        session.write({'created_order_id': order.id, 'status': 'completed'})
        return {'success': True, 'data': {'order_ref': order.order_ref, 'order_id': order.id}}

    @http.route('/api/v1/self-order/order-status/<int:order_id>', type='json', auth='public', methods=['GET'])
    def get_order_status(self, order_id, **kwargs):
        order = request.env['odfe.order'].sudo().browse(order_id)
        if not order.exists():
            return {'success': False, 'error': 'Order not found'}
        return {
            'success': True,
            'data': {
                'order_ref': order.order_ref,
                'status': order.status,
                'items': [{
                    'name': l.product_id.name,
                    'qty': l.qty,
                    'status': l.status,
                } for l in order.order_line_ids],
                'total': order.total,
            }
        }
