Ext.define('cardioCatalogQT.store.LabTests', {
    extend: 'Ext.data.Store',
    alias: 'store.LabTests',
    // add package.framework=ext to .sencha/app/sencha.cfg
    config:{
        model: 'cardioCatalogQT.model.LabTest',
        storeId: 'LabTests',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: 'http://127.0.0.1/api/factor/',
            reader: {
                type: 'json',
                rootProperty: 'clinical_data'
            }
        }
    }
});