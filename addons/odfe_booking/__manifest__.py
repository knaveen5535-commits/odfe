{
    'name': 'ODFE Booking',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Table bookings and reservations',
    'description': 'Manage table bookings, reservations, and scheduling for the cafe.',
    'depends': ['odfe_base', 'odfe_floor', 'odfe_customer'],
    'data': [
        'views/booking_views.xml',
        'views/reservation_views.xml',
        'wizard/booking_wizard_views.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
