from odoo import http
from odoo.http import request


class OdFeCustomerDisplayController(http.Controller):

    @http.route('/odfe/customer-display/<int:order_id>', type='http', auth='public', website=True)
    def display_order(self, order_id, **kwargs):
        order = request.env['odfe.order'].sudo().browse(order_id)
        if not order.exists():
            return request.not_found()
        return request.render('odfe_customer_display.order_display', {'order': order})

    @http.route('/api/v1/customer-display/<int:order_id>', type='json', auth='public', methods=['GET'])
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
                    'name': line.product_id.name,
                    'qty': line.qty,
                    'status': line.status,
                } for line in order.order_line_ids],
            }
        }
