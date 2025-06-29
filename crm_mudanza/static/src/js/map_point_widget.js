/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, onMounted, onWillUpdateProps, reactive, useRef } from "@odoo/owl";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

class MapPointWidget extends Component {
    static template = "crm_mudanza.MapPointWidget";
    static props = { ...standardFieldProps };

    setup() {
        this.map = null;
        this.origenMarker = null;
        this.destinoMarker = null;
        this.mapContainer = useRef("map-container");
        this.state = reactive({ mode: 'origen' });

        onMounted(() => this.renderMap());

        onWillUpdateProps((nextProps) => {
            const { origen_lat, origen_lon, destino_lat, destino_lon } = nextProps.record.data;
            this.updateMarker(this.origenMarker, origen_lat, origen_lon, 'origen');
            this.updateMarker(this.destinoMarker, destino_lat, destino_lon, 'destino');
        });
    }

    setMode(newMode) {
        this.state.mode = newMode;
    }

    renderMap() {
        const { origen_lat, origen_lon } = this.props.record.data;
        const initialCoords = [origen_lat || 18.7357, origen_lon || -70.1627];
        const initialZoom = origen_lat ? 13 : 8;

        this.map = L.map(this.mapContainer.el).setView(initialCoords, initialZoom);

        // ===== ¡ESTA ES LA ÚNICA LÍNEA QUE HA CAMBIADO! =====
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 2, maxZoom: 19,
        }).addTo(this.map);
        // ======================================================

        this.origenMarker = this.createMarker(this.props.record.data.origen_lat, this.props.record.data.origen_lon);
        this.destinoMarker = this.createMarker(this.props.record.data.destino_lat, this.props.record.data.destino_lon);

        this.map.on('click', (ev) => {
            const { lat, lng } = ev.latlng;
            const fieldsToUpdate = {};
            if (this.state.mode === 'origen') {
                fieldsToUpdate.origen_lat = lat;
                fieldsToUpdate.origen_lon = lng;
                this.updateMarker(this.origenMarker, lat, lng, 'origen');
            } else {
                fieldsToUpdate.destino_lat = lat;
                fieldsToUpdate.destino_lon = lng;
                this.updateMarker(this.destinoMarker, lat, lng, 'destino');
            }
            this.props.record.update(fieldsToUpdate);
        });
    }

    createMarker(lat, lon) {
        return (lat && lon) ? L.marker([lat, lon]).addTo(this.map) : null;
    }

    updateMarker(marker, lat, lon, type) {
        if (lat && lon) {
            if (marker) {
                marker.setLatLng([lat, lon]);
            } else {
                const newMarker = this.createMarker(lat, lon);
                if (type === 'origen') this.origenMarker = newMarker;
                else if (type === 'destino') this.destinoMarker = newMarker;
            }
        }
    }
}

registry.category("fields").add("map_point_widget", {
    component: MapPointWidget,
});