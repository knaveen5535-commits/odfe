{
    'name': 'ODFE Kitchen Display',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Kitchen Display System',
    'description': 'Kitchen display system for order management with status transitions.',
    'depends': ['odfe_base', 'odfe_pos', 'odfe_realtime'],
    'data': [
        'views/kds_views.xml',
        'views/kds_dashboard.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
