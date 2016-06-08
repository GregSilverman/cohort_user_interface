Ext.define('cardioCatalogQT.store.Races', {
    extend: 'Ext.data.Store',
    alias: 'store.Races',
    config:{
        model: 'cardioCatalogQT.model.Race',
        storeId: 'Races',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: cardioCatalogQT.config.protocol +
                 cardioCatalogQT.config.host +
                 cardioCatalogQT.config.apiMenu +
                 'race',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});