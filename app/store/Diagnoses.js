Ext.define('cardioCatalogQT.store.Diagnoses', {
    extend: 'Ext.data.Store',
    alias: 'store.Diagnoses',
    // add package.framework=ext to .sencha/app/sencha.cfg
    config:{
        model: 'cardioCatalogQT.model.Diagnosis',
        storeId: 'Diagnoses',
        autoLoad: true,
        sorters: 'string_value',

        proxy: {
            type: 'rest',
            url: //cardioCatalogQT.service.UtilityService.urlFactor('diagnoses'),
            'http://imagelibrary.ahc.umn.edu/api/factor/diagnoses',

            reader: {
                type: 'json',
                rootProperty: 'diagnoses'
            }
        }
    }
});