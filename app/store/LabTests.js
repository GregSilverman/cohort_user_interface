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
            url: 'http://imagelibrary.ahc.umn.edu/api/factor/labs',
            reader: {
                type: 'json',
                rootProperty: 'clinical_data'
            }
        }
    }
});