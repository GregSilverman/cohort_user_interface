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
            url: 'http://imagelibrary.ahc.umn.edu/api/factor/procedures',
            reader: {
                type: 'json',
                rootProperty: 'clinical_data'
            }
        }
    }
});