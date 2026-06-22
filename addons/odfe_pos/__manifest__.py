{
    'name': 'ODFE POS',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Core POS module',
    'description': 'Core POS management: cart, orders, order lines, receipts, sessions.',
    'depends': ['odfe_base', 'odfe_product', 'odfe_floor', 'odfe_customer'],
    'data': [
        'data/pos_data.xml',
        'views/order_views.xml',
        'views/order_line_views.xml',
        'views/receipt_views.xml',
        'views/session_views.xml',
        'views/pos_assets.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
