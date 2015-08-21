Ext.define('cardioCatalogQT.store.Queries', {
    extend: 'Ext.data.Store',
    alias: 'store.Queries',

    config:{
        model: 'cardioCatalogQT.model.Query',
            storeId: 'Queries',
            autoLoad: true,

            proxy: {
            type: 'rest',
                url: 'http://127.0.0.1:5000/remote_query_get',
                reader: {
                type: 'json',
                    rootProperty: 'cc_query'
            }
        }
    }
});