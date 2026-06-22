from odoo import models, fields


class OdFeReservation(models.Model):
    _name = 'odfe.reservation'
    _description = 'Reservation'
    _inherit = ['mail.thread']
    _rec_name = 'reservation_ref'

    reservation_ref = fields.Char(string='Reference', required=True, copy=False, readonly=True)
    customer_id = fields.Many2one('odfe.customer', string='Customer', required=True)
    table_ids = fields.Many2many('odfe.table', string='Tables')
    start_time = fields.Datetime(string='Start Time', required=True)
    end_time = fields.Datetime(string='End Time', required=True)
    status = fields.Selection([
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('seated', 'Seated'),
        ('finished', 'Finished'),
        ('no_show', 'No Show'),
    ], string='Status', default='pending', tracking=True)
    special_occasion = fields.Selection([
        ('birthday', 'Birthday'),
        ('anniversary', 'Anniversary'),
        ('business', 'Business'),
        ('other', 'Other'),
    ], string='Occasion')
