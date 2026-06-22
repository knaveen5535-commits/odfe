import pytest


class TestSecurityGroups:
    def test_admin_access(self, admin_client):
        response = admin_client.get('/api/v1/employees')
        assert response.status_code == 200

    def test_kitchen_restricted_access(self, kitchen_client):
        response = kitchen_client.get('/api/v1/settings')
        assert response.status_code in [401, 403]
