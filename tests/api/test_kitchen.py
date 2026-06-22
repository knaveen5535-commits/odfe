import pytest


class TestKitchenFlow:
    def test_order_status_transitions(self, kds_order):
        assert kds_order.status == 'new'
        kds_order.action_prepare()
        assert kds_order.status == 'preparing'
        kds_order.action_ready()
        assert kds_order.status == 'ready'
        kds_order.action_serve()
        assert kds_order.status == 'served'

    def test_invalid_transition(self, kds_order):
        with pytest.raises(Exception):
            kds_order.action_serve()  # Can't serve from 'new'
