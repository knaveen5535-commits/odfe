import pytest
from odoo.tests.common import TransactionCase


class TestProductModel(TransactionCase):
    def setUp(self):
        super().setUp()
        self.Product = self.env['odfe.product']
        self.Category = self.env['odfe.product.category']

    def test_create_product(self):
        category = self.Category.create({'name': 'Test Category'})
        product = self.Product.create({
            'name': 'Test Product',
            'category_id': category.id,
            'sale_price': 10.0,
        })
        self.assertEqual(product.name, 'Test Product')
        self.assertEqual(product.sale_price, 10.0)
