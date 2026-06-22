{
    'name': 'ODFE Product',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Product catalog management',
    'description': 'Manage products, categories, taxes, and units of measure.',
    'depends': ['odfe_base'],
    'data': [
        'data/product_data.xml',
        'views/product_views.xml',
        'views/category_views.xml',
        'views/tax_views.xml',
        'views/uom_views.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
