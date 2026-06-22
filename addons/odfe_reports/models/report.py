from odoo import models, fields, api
from datetime import datetime, timedelta
import io
import xlsxwriter
import base64


class OdFeReport(models.Model):
    _name = 'odfe.report'
    _description = 'Report'
    _rec_name = 'name'

    name = fields.Char(string='Report Name', required=True)
    report_type = fields.Selection([
        ('sales', 'Sales Report'),
        ('revenue', 'Revenue Report'),
        ('employee', 'Employee Report'),
        ('order', 'Order Report'),
    ], string='Report Type', required=True)
    date_from = fields.Date(string='From Date')
    date_to = fields.Date(string='To Date')
    output_format = fields.Selection([
        ('pdf', 'PDF'),
        ('xlsx', 'XLSX'),
    ], string='Output Format', default='pdf')
    report_file = fields.Binary(string='Report File')
    report_filename = fields.Char(string='Filename')

    def generate_sales_report(self):
        domain = []
        if self.date_from:
            domain.append(('order_date', '>=', self.date_from.strftime('%Y-%m-%d')))
        if self.date_to:
            domain.append(('order_date', '<=', self.date_to.strftime('%Y-%m-%d')))
        orders = self.env['odfe.order'].search(domain)
        if self.output_format == 'xlsx':
            return self._generate_xlsx(orders, 'Sales Report')
        return self._generate_data(orders)

    def _generate_data(self, orders):
        data = {
            'report_name': self.name,
            'date_from': self.date_from,
            'date_to': self.date_to,
            'total_orders': len(orders),
            'total_revenue': sum(orders.mapped('total')),
            'orders': [{
                'ref': o.order_ref,
                'date': o.order_date,
                'total': o.total,
                'status': o.status,
                'employee': o.employee_id.name,
            } for o in orders],
        }
        return data

    def _generate_xlsx(self, orders, title):
        output = io.BytesIO()
        workbook = xlsxwriter.Workbook(output)
        sheet = workbook.add_worksheet(title)
        bold = workbook.add_format({'bold': True})
        headers = ['Order Ref', 'Date', 'Employee', 'Total', 'Status']
        for col, header in enumerate(headers):
            sheet.write(0, col, header, bold)
        for row, order in enumerate(orders, 1):
            sheet.write(row, 0, order.order_ref)
            sheet.write(row, 1, str(order.order_date))
            sheet.write(row, 2, order.employee_id.name)
            sheet.write(row, 3, order.total)
            sheet.write(row, 4, order.status)
        workbook.close()
        output.seek(0)
        file_data = base64.b64encode(output.read()).decode()
        self.write({
            'report_file': file_data,
            'report_filename': f'{title}_{datetime.now().strftime("%Y%m%d")}.xlsx',
        })
        return True
