Ext.define('cardioCatalogQT.store.Atoms', {
    extend: 'Ext.data.Store',
    alias: 'store.Atoms',

    config:{
        idProperty: 'id',
        fields: [
            {name: 'type', type: 'string'},
            {name: 'key', type: 'string'},
            {name: 'atomic_unit', type: 'string'}

        ],

        storeId: 'Atoms',
        autoLoad: true,

        proxy: {
            type: 'sessionstorage',
            id: 'atoms'
        }
    }
});