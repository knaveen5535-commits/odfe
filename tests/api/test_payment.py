import pytest
from odoo.tests.common import TransactionCase


class TestPaymentFlow(TransactionCase):
    def setUp(self):
        super().setUp()
        self.Payment = self.env['odfe.payment']
        self.PaymentMethod = self.env['odfe.payment.method']

    def test_cash_payment(self):
        method = self.PaymentMethod.search([('code', '=', 'CASH')], limit=1)
        payment = self.Payment.create({
            'method_id': method.id,
            'amount': 50.0,
            'order_id': self.env['odfe.order'].create({'session_id': False, 'employee_id': False}).id,
        })
        payment.action_complete()
        self.assertEqual(payment.status, 'completed')
