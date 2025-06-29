{
    'name': 'CRM Mudanza',
    'version': '18.0.1.0.0',
    'summary': 'Registra transportes con puntos de origen y destino en un mapa.',
    'author': 'Tu Nombre',
    'category': 'Operations/Fleet',
    'depends': [
        'base', 
        'web',
        'mail', # Necesario para el historial y seguimiento (chatter)
    ],
    'data': [
        # 1. Seguridad (siempre primero)
        'security/ir.model.access.csv',
        # 1.1 Secuencias
        'data/ir_sequence.xml',
        # 2. Vistas (cómo se ven los datos)
        'views/transporte_views.xml',
        # 3. Menús (cómo accede el usuario)
        'views/transporte_menus.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'crm_mudanza/static/lib/leaflet/leaflet.css',
            'crm_mudanza/static/lib/leaflet/leaflet.js',
            'crm_mudanza/static/src/js/map_point_widget.js',
            'crm_mudanza/static/src/xml/map_point_widget.xml',
        ],
    },
    'application': True,
    'installable': True,
    'license': 'LGPL-3',
}