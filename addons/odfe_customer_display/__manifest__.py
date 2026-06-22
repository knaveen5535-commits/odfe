{
    'name': 'ODFE Customer Display',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Customer-facing display',
    'description': 'Display controller and templates for customer-facing screen showing order status.',
    'depends': ['odfe_pos', 'odfe_realtime'],
    'data': [
        'views/customer_display_template.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
