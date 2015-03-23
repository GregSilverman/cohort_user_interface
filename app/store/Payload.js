Ext.define('cardioCatalogQT.store.Payload', {
    extend: 'Ext.data.Store',
    alias: 'store.Payload',

    config:{
        idProperty: 'id',
        fields: [
            {name: 'type', type: 'string'},
            {name: 'key', type: 'string'},
            {name: 'comparator', type: 'string'},
            {name: 'value', type: 'string'}
        ],

        storeId: 'Payload',
        autoLoad: true,

        proxy: {
            type: 'sessionstorage',
            id: 'payload'
        }
    }
});