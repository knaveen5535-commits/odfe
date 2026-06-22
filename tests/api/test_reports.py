import pytest
from odoo.tests.common import TransactionCase


class TestReportGeneration(TransactionCase):
    def test_sales_report(self):
        report = self.env['odfe.report'].create({
            'name': 'Test Sales Report',
            'report_type': 'sales',
            'output_format': 'xlsx',
        })
        result = report.generate_sales_report()
        self.assertTrue(result)
