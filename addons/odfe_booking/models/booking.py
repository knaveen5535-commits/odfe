from odoo import models, fields, api
from odoo.exceptions import ValidationError


class OdFeBooking(models.Model):
    _name = 'odfe.booking'
    _description = 'Table Booking'
    _rec_name = 'booking_ref'
    _order = 'booking_date desc, id desc'

    booking_ref = fields.Char(string='Booking Reference', required=True, copy=False, readonly=True)
    customer_id = fields.Many2one('odfe.customer', string='Customer', required=True)
    table_id = fields.Many2one('odfe.table', string='Table', required=True)
    booking_date = fields.Datetime(string='Booking Date', required=True)
    duration = fields.Float(string='Duration (hours)', default=2.0)
    guests = fields.Integer(string='Number of Guests', default=1)
    status = fields.Selection([
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('checked_in', 'Checked In'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], string='Status', default='draft', tracking=True)
    notes = fields.Text(string='Special Requests')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if not vals.get('booking_ref'):
                vals['booking_ref'] = self.env['ir.sequence'].next_by_code('odfe.booking')
        return super().create(vals_list)

    def action_confirm(self):
        self.status = 'confirmed'

    def action_check_in(self):
        self.status = 'checked_in'
        self.table_id.write({'status': 'occupied'})

    def action_complete(self):
        self.status = 'completed'
        self.table_id.write({'status': 'available'})

    def action_cancel(self):
        self.status = 'cancelled'
        self.table_id.write({'status': 'available'})
