Ext.define('cardioCatalogQT.store.Diagnoses', {
    extend: 'Ext.data.Store',
    alias: 'store.Diagnoses',
    config:{
        model: 'cardioCatalogQT.model.Diagnosis',
        storeId: 'Diagnoses',
        autoLoad: true,

        proxy: {
            type: 'rest',
            //url: 'http://127.0.0.1:5000/menu/diagnoses',
            url: 'https://vein.ahc.umn.edu/api/menu/diagnoses',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});
