Ext.define('cardioCatalogQT.store.Queries', {
    extend: 'Ext.data.Store',
    alias: 'store.Queries',

    config:{
        model: 'cardioCatalogQT.model.Query',
            storeId: 'Queries',
            autoLoad: true,

            proxy: {
            type: 'rest',
                //url: 'https://cc.cardio.umn.edu/api/remote_query_get',
                url: 'https://vein.ahc.umn.edu/api/remote_query_get',
                reader: {
                type: 'json',
                    rootProperty: 'cc_query'
            }
        }
    }
});