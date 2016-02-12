Ext.define('cardioCatalogQT.store.Procedures', {
    extend: 'Ext.data.Store',
    alias: 'store.Procedures',
    config:{
        model: 'cardioCatalogQT.model.Procedure',
        storeId: 'Procedures',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: cardioCatalogQT.config.protocol +
                 cardioCatalogQT.config.host +
                 cardioCatalogQT.config.apiMenu +
                 'procedures',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});