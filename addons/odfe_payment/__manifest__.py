{
    'name': 'ODFE Payment',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Payment processing',
    'description': 'Handle cash, card, UPI, and QR code payments.',
    'depends': ['odfe_base', 'odfe_pos'],
    'data': [
        'data/payment_data.xml',
        'views/payment_views.xml',
        'views/payment_method_views.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
