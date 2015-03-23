Ext.define('cardioCatalogQT.store.Queries', {
    extend: 'Ext.data.Store',
    alias: 'store.Queries',

    config:{
        idProperty: 'id',
        fields: [
            {name: 'url', type: 'string'},
            {name: 'user', type: 'string'}
        ],

        storeId: 'Queries',
        autoLoad: true,

        proxy: {
            type: 'localstorage',
            id: 'queries'
        }
    }
});