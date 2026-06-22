odoo.define('odfe_auth.auth', function (require) {
    'use strict';
    var core = require('web.core');
    var Widget = require('web.Widget');
    var AuthWidget = Widget.extend({
        template: 'odfe_auth.login_page',
        init: function (parent, options) {
            this._super(parent, options);
        },
        start: function () {
            return this._super();
        }
    });
    core.action_registry.add('odfe_auth_login', AuthWidget);
    return AuthWidget;
});
