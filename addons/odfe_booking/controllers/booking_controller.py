from odoo import http
from odoo.http import request
import json


class OdFeBookingController(http.Controller):

    @http.route('/api/v1/bookings', type='http', auth='user', methods=['GET'], csrf=False)
    def get_bookings(self, **kwargs):
        bookings = request.env['odfe.booking'].search([])
        data = [{
            'id': b.id,
            'ref': b.booking_ref,
            'customer': b.customer_id.name,
            'table': b.table_id.name,
            'date': b.booking_date.isoformat(),
            'guests': b.guests,
            'status': b.status,
        } for b in bookings]
        return request.make_response(json.dumps({'success': True, 'data': data}), headers={'Content-Type': 'application/json'})

    @http.route('/api/v1/bookings', type='http', auth='user', methods=['POST'], csrf=False)
    def create_booking(self, **kwargs):
        data = json.loads(request.httprequest.data)
        booking = request.env['odfe.booking'].create({
            'customer_id': data.get('customer_id'),
            'table_id': data.get('table_id'),
            'booking_date': data.get('booking_date'),
            'guests': data.get('guests', 1),
            'duration': data.get('duration', 2.0),
            'notes': data.get('notes', ''),
        })
        return request.make_response(
            json.dumps({'success': True, 'data': {'id': booking.id, 'ref': booking.booking_ref}}),
            headers={'Content-Type': 'application/json'}
        )
