Ext.define('cardioCatalogQT.store.Medications', {
    extend: 'Ext.data.Store',
    alias: 'store.Medications',
    config:{
        model: 'cardioCatalogQT.model.Medication',
        storeId: 'Medications',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: 'http://cc.cardio.umn.edu/api/menu/medications',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});