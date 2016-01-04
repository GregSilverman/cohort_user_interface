Ext.define('cardioCatalogQT.store.Ethnicities', {
    extend: 'Ext.data.Store',
    alias: 'store.Ethnicities',
    config:{
        model: 'cardioCatalogQT.model.Ethnicity',
        storeId: 'Ethnicities',
        autoLoad: true,

        proxy: {
            type: 'rest',
            //url: 'http://127.0.0.1:5000/menu/ethnicity',
            url: 'https://vein.ahc.umn.edu/api/menu/ethnicity',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});