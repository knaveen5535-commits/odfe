{
    'name': 'ODFE Base',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Base module for ODFE Cafe POS',
    'description': 'Shared models, mixins, and configuration for all ODFE modules.',
    'depends': ['base', 'mail', 'web'],
    'data': [
        'data/sequence_data.xml',
        'views/base_config_view.xml',
        'views/menu_root.xml',
    ],
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
