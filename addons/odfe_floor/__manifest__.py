{
    'name': 'ODFE Floor',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Floor plans and table management',
    'description': 'Manage floor plans, tables, and table status tracking.',
    'depends': ['odfe_base'],
    'data': [
        'data/floor_data.xml',
        'views/floor_views.xml',
        'views/table_views.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
