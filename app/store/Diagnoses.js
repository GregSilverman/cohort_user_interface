Ext.define('cardioCatalogQT.store.Diagnoses', {
    extend: 'Ext.data.Store',
    alias: 'store.Diagnoses',
    config:{
        model: 'cardioCatalogQT.model.Diagnosis',
        storeId: 'Diagnoses',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: 'http://cc.cardio.umn.edu/api/menu/diagnoses',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});
