Ext.define('cardioCatalogQT.store.Payload', {
    extend: 'Ext.data.Store',
    alias: 'store.Payload',
    // add package.framework=ext to .sencha/app/sencha.cfg
    config:{
        idProperty: 'id',
        fields: [
            {name: 'type', type: 'string'},
            {name: 'key', type: 'string'},
            {name: 'comparator', type: 'string'},
            {name: 'value', type: 'string'}
        ] ,

        //model: 'cardioCatalogQT.model.Load',
        storeId: 'Payload',
        autoLoad: true,

        proxy: {
            type: 'localstorage',
            id: 'payload'
        }
    }
});