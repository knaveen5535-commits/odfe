import pytest
import json


class TestOrderController:
    def test_get_orders(self, client):
        response = client.get('/api/v1/orders')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True

    def test_create_order(self, client, sample_order_data):
        response = client.post('/api/v1/orders', json=sample_order_data)
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['success'] is True
