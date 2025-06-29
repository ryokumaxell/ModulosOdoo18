from odoo import models, fields, api

class TransporteRegistro(models.Model):
    _name = 'transporte.registro'
    _description = 'Registro de un Transporte'
    _inherit = ['mail.thread', 'mail.activity.mixin'] # Para el chatter

    name = fields.Char(string="Referencia", required=True, copy=False, readonly=True, default=lambda self: 'Nuevo')
    cliente_id = fields.Many2one('res.partner', string="Cliente")
    fecha_planificada = fields.Date(string="Fecha Planificada", default=fields.Date.context_today)
    
    state = fields.Selection([
        ('nuevo', 'Nuevo'),
        ('en_progreso', 'En Progreso'),
        ('hecho', 'Hecho'),
        ('cancelado', 'Cancelado'),
    ], string="Estado", default='nuevo', tracking=True)

    # Campos para las coordenadas que se llenar�n desde el mapa
    origen_lat = fields.Float(string="Latitud Origen", digits=(10, 7))
    origen_lon = fields.Float(string="Longitud Origen", digits=(10, 7))
    destino_lat = fields.Float(string="Latitud Destino", digits=(10, 7))
    destino_lon = fields.Float(string="Longitud Destino", digits=(10, 7))

    # Campo "dummy" para poder colocar el widget en la vista de formulario
    map_widget_placeholder = fields.Boolean(string="Mapa", default=False)

    # Sobreescribimos el m�todo create para asignar una secuencia
    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('name', 'Nuevo') == 'Nuevo':
                vals['name'] = self.env['ir.sequence'].next_by_code('transporte.registro') or 'Nuevo'
        return super().create(vals_list)