from odoo import models, fields, api
from datetime import datetime, timedelta


class OdFeDashboard(models.Model):
    _name = 'odfe.dashboard'
    _description = 'Dashboard Metrics'
    _auto = False

    def get_today_summary(self):
        today = datetime.now().strftime('%Y-%m-%d')
        Order = self.env['odfe.order']
        today_orders = Order.search([('order_date', '>=', today)])
        return {
            'total_orders': len(today_orders),
            'total_revenue': sum(today_orders.mapped('total')),
            'average_order': sum(today_orders.mapped('total')) / max(len(today_orders), 1),
            'pending_orders': len(Order.search([('status', '=', 'draft')])),
        }

    def get_weekly_revenue(self):
        week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        orders = self.env['odfe.order'].search([('order_date', '>=', week_ago)])
        daily = {}
        for order in orders:
            day = order.order_date[:10]
            daily[day] = daily.get(day, 0) + order.total
        return [{'date': d, 'revenue': daily[d]} for d in sorted(daily.keys())]

    def get_top_products(self, limit=10):
        OrderLine = self.env['odfe.order.line']
        today = datetime.now().strftime('%Y-%m-%d')
        lines = OrderLine.search([('order_id.order_date', '>=', today)])
        product_sales = {}
        for line in lines:
            pid = line.product_id.id
            if pid not in product_sales:
                product_sales[pid] = {'name': line.product_id.name, 'qty': 0, 'revenue': 0}
            product_sales[pid]['qty'] += line.qty
            product_sales[pid]['revenue'] += line.subtotal
        sorted_products = sorted(product_sales.values(), key=lambda x: x['qty'], reverse=True)
        return sorted_products[:limit]
