Ext.define('cardioCatalogQT.store.Procedures', {
    extend: 'Ext.data.Store',
    alias: 'store.Procedures',
    // add package.framework=ext to .sencha/app/sencha.cfg
    config:{
        model: 'cardioCatalogQT.model.Procedure',
        storeId: 'Procedures',
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