{
    'name': 'ODFE Coupon',
    'version': '1.0',
    'category': 'Cafe/POS',
    'summary': 'Coupons and promotions',
    'description': 'Manage coupons, promotions, and discount rules for orders and products.',
    'depends': ['odfe_base', 'odfe_product'],
    'data': [
        'data/coupon_data.xml',
        'views/coupon_views.xml',
        'views/promotion_views.xml',
        'security/ir.model.access.csv',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
