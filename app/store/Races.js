Ext.define('cardioCatalogQT.store.Races', {
    extend: 'Ext.data.Store',
    alias: 'store.Races',
    config:{
        model: 'cardioCatalogQT.model.Race',
        storeId: 'Races',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: 'http://127.0.0.1:5000/menu/race',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});