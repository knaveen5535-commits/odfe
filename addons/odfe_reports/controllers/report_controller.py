from odoo import http
from odoo.http import request
import json


class OdFeReportController(http.Controller):

    @http.route('/api/v1/reports/generate', type='json', auth='user', methods=['POST'])
    def generate_report(self, **kwargs):
        report = request.env['odfe.report'].create({
            'name': kwargs.get('name', 'Report'),
            'report_type': kwargs.get('report_type', 'sales'),
            'date_from': kwargs.get('date_from'),
            'date_to': kwargs.get('date_to'),
            'output_format': kwargs.get('format', 'pdf'),
        })
        data = report.generate_sales_report()
        return {'success': True, 'data': data}
