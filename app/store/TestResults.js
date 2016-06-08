Ext.define('cardioCatalogQT.store.TestResults', {
    extend: 'Ext.data.Store',
    alias: 'store.TestResult',

    config:{
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
