{
    'name': 'ODFE Dashboard',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Analytics and sales dashboard',
    'description': 'Sales analytics, reports, and dashboard views.',
    'depends': ['odfe_base', 'odfe_pos'],
    'data': [
        'views/dashboard_views.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
