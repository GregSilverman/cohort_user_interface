Ext.define('cardioCatalogQT.store.TestResult', {
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
            //type: 'localstorage',
            url: 'http://127.0.0.1/remote_results_put',
            //type: 'localstorage',
            type: 'rest',
            reader: {
                type: 'json',
                rootProperty: 'results'
            }
            //id: 'items'
        }
    }
});