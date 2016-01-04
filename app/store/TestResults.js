Ext.define('cardioCatalogQT.store.TestResults', {
    extend: 'Ext.data.Store',
    alias: 'store.TestResults',

    config:{
        /*idProperty: 'id',
        fields: [
            {name: 'attribute', type: 'string'},
            {name: 'sid', type: 'string'},
            {name: 'value_s', type: 'string'},
            {name: 'value_d', type: 'string'}
        ],*/
        model: 'cardioCatalogQT.model.TestResult',

        storeId: 'TestResults',
        autoLoad: true,
        pageSize: undefined,

        proxy: {
            //type: 'localstorage',
            //url: 'http://127.0.0.1/api/remote_results_get',
            url: 'https://vein.ahc.umn.edu/api/remote_results_get',
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
