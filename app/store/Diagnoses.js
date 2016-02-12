Ext.define('cardioCatalogQT.store.Diagnoses', {
    extend: 'Ext.data.Store',
    alias: 'store.Diagnoses',
    config:{
        model: 'cardioCatalogQT.model.Diagnosis',
        storeId: 'Diagnoses',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: cardioCatalogQT.config.protocol +
                 cardioCatalogQT.config.host +
                 cardioCatalogQT.config.apiMenu +
                 'diagnoses',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});
