Ext.define('cardioCatalogQT.store.Races', {
    extend: 'Ext.data.Store',
    alias: 'store.Races',
    config:{
        model: 'cardioCatalogQT.model.Attributes',
        storeId: 'Attributes',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: cardioCatalogQT.config.protocol +
                 cardioCatalogQT.config.host +
                 cardioCatalogQT.config.apiAttributeGet,
            reader: {
                type: 'json',
                rootProperty: 'attribute'
            }
        }
    }
});