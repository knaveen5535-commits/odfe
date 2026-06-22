{
    'name': 'ODFE Realtime',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'WebSocket and real-time sync',
    'description': 'WebSocket controller, Odoo bus integration, and real-time notification system.',
    'depends': ['base', 'bus'],
    'data': [
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
