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
            url: cardioCatalogQT.config.protocol +
                 cardioCatalogQT.config.host +
                 cardioCatalogQT.config.apiResultsGet,
            type: 'rest',
            reader: {
                type: 'json',
                rootProperty: 'results'
            }
            //id: 'items'
        }
    }
});
