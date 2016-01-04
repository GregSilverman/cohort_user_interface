Ext.define('cardioCatalogQT.store.Procedures', {
    extend: 'Ext.data.Store',
    alias: 'store.Procedures',
    config:{
        model: 'cardioCatalogQT.model.Procedure',
        storeId: 'Procedures',
        autoLoad: true,

        proxy: {
            type: 'rest',
            //url: 'http://127.0.0.1:5000/menu/procedures',
            url: 'https://vein.ahc.umn.edu/api/menu/procedures',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});