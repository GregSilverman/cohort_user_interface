Ext.define('cardioCatalogQT.store.Labs', {
    extend: 'Ext.data.Store',
    alias: 'store.LabTests',
    config:{
        model: 'cardioCatalogQT.model.Lab',
        storeId: 'LabTests',
        autoLoad: true,

        proxy: {
            type: 'rest',
            //url: 'http://127.0.0.1:5000/menu/labs',
            url: 'https://vein.ahc.umn.edu/api/menu/labs',
            reader: {
                type: 'json',
                rootProperty: 'menu_test'
            }
        }
    }
});