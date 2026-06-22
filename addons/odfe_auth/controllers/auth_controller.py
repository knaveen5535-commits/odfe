from odoo import http
from odoo.http import request
from odoo.addons.web.controllers.main import Home


class OdFeAuthController(http.Controller):

    @http.route('/odfe/auth/login', type='http', auth='public', website=True, sitemap=False)
    def login(self, **kwargs):
        if request.session.uid:
            return request.redirect('/odfe')
        error = kwargs.get('error', '')
        return request.render('odfe_auth.login_page', {'error': error})

    @http.route('/odfe/auth/logout', type='http', auth='user', website=True, sitemap=False)
    def logout(self, **kwargs):
        request.session.logout()
        return request.redirect('/odfe/auth/login')
