Ext.define('cardioCatalogQT.store.Labs', {
    extend: 'Ext.data.Store',
    alias: 'store.LabTests',
    config:{
        model: 'cardioCatalogQT.model.Lab',
        storeId: 'LabTests',
        autoLoad: true,

        proxy: {
            type: 'rest',
            url: 'http://imagelibrary.ahc.umn.edu/api/menu/labs',
            reader: {
                type: 'json',
                rootProperty: 'menu'
            }
        }
    }
});