Ext.define('cardioCatalogQT.store.Ethnicities', {
    extend: 'Ext.data.Store',
    alias: 'store.Ethnicities',
    config:{
        model: 'cardioCatalogQT.model.Ethnicity',
        storeId: 'Ethnicities',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: cardioCatalogQT.config.protocol +
                 cardioCatalogQT.config.host +
                 cardioCatalogQT.config.apiMenu +
                 'ethnicity',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});