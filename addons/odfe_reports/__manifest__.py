{
    'name': 'ODFE Reports',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'PDF and XLSX report exports',
    'description': 'Generate PDF and XLSX reports for sales, revenue, employees, and orders.',
    'depends': ['odfe_base', 'odfe_pos', 'odfe_payment'],
    'data': [
        'views/report_views.xml',
        'views/sales_report_template.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
