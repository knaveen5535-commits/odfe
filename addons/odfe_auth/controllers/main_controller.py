from odoo import http
from odoo.http import request


class OdFeMainController(http.Controller):

    @http.route('/odfe', type='http', auth='user', website=True, sitemap=False)
    def index(self, **kwargs):
        return request.render('odfe_auth.landing_page')
