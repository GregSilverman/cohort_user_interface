Ext.define('cardioCatalogQT.store.Medications', {
    extend: 'Ext.data.Store',
    alias: 'store.Diagnoses',
    // add package.framework=ext to .sencha/app/sencha.cfg
    config:{
        model: 'cardioCatalogQT.model.Medication',
        storeId: 'Medications',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: 'http://127.0.0.1:5000/api/factor',
            reader: {
                type: 'json',
                rootProperty: 'clinical_data'
            }
        }
    }
});