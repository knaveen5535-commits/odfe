from odoo import models, fields, api
from datetime import datetime


class OdFePosSession(models.Model):
    _name = 'odfe.pos.session'
    _description = 'POS Session'
    _rec_name = 'name'
    _order = 'start_date desc'

    name = fields.Char(string='Session Name', required=True, readonly=True)
    employee_id = fields.Many2one('odfe.employee', string='Employee', required=True)
    start_date = fields.Datetime(string='Start Date', default=fields.Datetime.now)
    end_date = fields.Datetime(string='End Date')
    status = fields.Selection([
        ('draft', 'Draft'),
        ('opened', 'Opened'),
        ('closed', 'Closed'),
    ], string='Status', default='draft', tracking=True)
    opening_cash = fields.Float(string='Opening Cash', default=0.0)
    closing_cash = fields.Float(string='Closing Cash')
    total_sales = fields.Float(string='Total Sales', compute='_compute_totals', store=True)
    total_orders = fields.Integer(string='Total Orders', compute='_compute_totals', store=True)
    order_ids = fields.One2many('odfe.order', 'session_id', string='Orders')

    @api.depends('order_ids', 'order_ids.total')
    def _compute_totals(self):
        for rec in self:
            rec.total_sales = sum(rec.order_ids.mapped('total'))
            rec.total_orders = len(rec.order_ids)

    def action_open(self):
        self.write({'status': 'opened', 'name': f'Session {datetime.now().strftime("%Y-%m-%d %H:%M")}'})

    def action_close(self):
        self.write({'status': 'closed', 'end_date': datetime.now()})
