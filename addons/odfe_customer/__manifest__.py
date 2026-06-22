{
    'name': 'ODFE Customer',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Customer profiles and loyalty',
    'description': 'Customer profile management and loyalty program.',
    'depends': ['odfe_base'],
    'data': [
        'data/loyalty_data.xml',
        'views/customer_views.xml',
        'views/loyalty_views.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
