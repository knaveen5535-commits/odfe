import pytest
import json


class TestSelfOrder:
    def test_get_menu(self, client):
        response = client.get('/api/v1/self-order/menu')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'products' in data['data']
