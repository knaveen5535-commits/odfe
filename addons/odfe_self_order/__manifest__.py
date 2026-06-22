{
    'name': 'ODFE Self Order',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'QR self-ordering system',
    'description': 'QR code per table, guest token-based session, menu browsing, and self-ordering.',
    'depends': ['odfe_base', 'odfe_pos', 'odfe_floor', 'odfe_product', 'odfe_payment'],
    'data': [
        'views/self_order_template.xml',
        'report/qr_sheet_report.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
