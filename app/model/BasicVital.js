Ext.define('cardioCatalogQT.model.BasicVital', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'units', type: 'string' },
        { name: 'measure', type: 'string' },
        { name: 'field_name', type: 'string' }
    ]
});