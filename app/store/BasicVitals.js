Ext.define('cardioCatalogQT.store.BasicVitals', {
    extend: 'Ext.data.Store',
    alias: 'store.BasicVitals',
    config:{
        model: 'cardioCatalogQT.model.Attribute',
        storeId: 'BasicVitals',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: cardioCatalogQT.config.protocol +
            cardioCatalogQT.config.host +
            cardioCatalogQT.config.apiBasicVitals,
            reader: {
                type: 'json',
                rootProperty: 'basic_vitals_units'
            }
        }
    }
});