from odoo import models, fields, api
import base64
import io
import qrcode


class OdFeQRCode(models.Model):
    _name = 'odfe.qr.code'
    _description = 'QR Code'

    name = fields.Char(string='Name', required=True)
    code_data = fields.Char(string='QR Data', required=True)
    image = fields.Binary(string='QR Image', attachment=True)
    model = fields.Char(string='Related Model')
    res_id = fields.Integer(string='Related Record ID')

    @api.model
    def generate_qr(self, data, name='QR Code'):
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        image_data = base64.b64encode(buffer.read()).decode()
        return self.create({
            'name': name,
            'code_data': data,
            'image': image_data,
        })
