from odoo import http
from odoo.http import request
from datetime import datetime


class OdFeMainController(http.Controller):

    @http.route('/odfe', type='http', auth='user', website=True, sitemap=False)
    def index(self, **kwargs):
        return request.redirect('/odfe/dashboard')

    @http.route('/odfe/dashboard', type='http', auth='user', website=True, sitemap=False)
    def dashboard(self, **kwargs):
        today = datetime.now().strftime('%Y-%m-%d')
        Order = request.env['odfe.order']
        today_orders = Order.search([('order_date', '>=', today)])
        values = {
            'total_orders': len(today_orders),
            'total_revenue': sum(today_orders.mapped('total')),
            'average_order': sum(today_orders.mapped('total')) / max(len(today_orders), 1),
            'pending_orders': len(Order.search([('status', '=', 'draft')])),
        }
        return request.render('odfe_auth.dashboard_page', values)
