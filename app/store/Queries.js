Ext.define('cardioCatalogQT.store.Queries', {
    extend: 'Ext.data.Store',
    alias: 'store.Queries',

    config:{
        model: 'cardioCatalogQT.model.Query',
            storeId: 'Queries',
            autoLoad: true,

            proxy: {
            type: 'rest',
                url: cardioCatalogQT.config.protocol +
                     cardioCatalogQT.config.host +
                     cardioCatalogQT.config.apiQueryGet,
                reader: {
                type: 'json',
                    rootProperty: 'cc_query'
            }
        }
    }
});