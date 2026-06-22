from odoo import models, fields, api


class OdFeBookingWizard(models.TransientModel):
    _name = 'odfe.booking.wizard'
    _description = 'Booking Wizard'

    customer_id = fields.Many2one('odfe.customer', string='Customer', required=True)
    table_id = fields.Many2one('odfe.table', string='Table', required=True)
    booking_date = fields.Datetime(string='Booking Date', required=True, default=fields.Datetime.now)
    guests = fields.Integer(string='Guests', default=1)
    duration = fields.Float(string='Duration (hours)', default=2.0)
    notes = fields.Text(string='Notes')

    def action_create_booking(self):
        booking = self.env['odfe.booking'].create({
            'customer_id': self.customer_id.id,
            'table_id': self.table_id.id,
            'booking_date': self.booking_date,
            'guests': self.guests,
            'duration': self.duration,
            'notes': self.notes,
        })
        return {
            'type': 'ir.actions.act_window',
            'res_model': 'odfe.booking',
            'res_id': booking.id,
            'view_mode': 'form',
        }
