Ext.define('cardioCatalogQT.store.Results', {
    extend: 'Ext.data.Store',
    alias: 'store.Results',

    config:{
        idProperty: 'id',
        fields: [
            {name: 'attribute', type: 'string'},
            {name: 'sid', type: 'string'},
            {name: 'string', type: 'string'},
            {name: 'number', type: 'string'}
        ],

        storeId: 'Results',
        autoLoad: true,
        pageSize: undefined,

        proxy: {
            type: 'localstorage',
            id: 'items'
        }
    }
});