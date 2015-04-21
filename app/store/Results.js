Ext.define('cardioCatalogQT.store.Results', {
    extend: 'Ext.data.Store',
    alias: 'store.Results',

    config:{
        idProperty: 'id',
        fields: [
            {name: 'attribue', type: 'string'},
            {name: 'sid', type: 'string'},
            {name: 'value', type: 'string'},
            {name: 'n', type: 'string'}
        ],

        storeId: 'Results',
        autoLoad: true,

        proxy: {
            type: 'localstorage',
            id: 'results'
        }
    }
});