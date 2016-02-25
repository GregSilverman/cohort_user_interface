Ext.define('cardioCatalogQT.store.Labs', {
    extend: 'Ext.data.Store',
    alias: 'store.LabTests',
    config:{
        model: 'cardioCatalogQT.model.Lab',
        storeId: 'LabTests',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: cardioCatalogQT.config.protocol +
                 cardioCatalogQT.config.host +
                 cardioCatalogQT.config.apiLabs,
            reader: {
                type: 'json',
                rootProperty: 'lab_units'
            }
        }
    }
});