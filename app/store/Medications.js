Ext.define('cardioCatalogQT.store.Medications', {
    extend: 'Ext.data.Store',
    alias: 'store.Medications',
    config:{
        model: 'cardioCatalogQT.model.Medication',
        storeId: 'Medications',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: 'http://127.0.0.1:5000/menu/medications',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});