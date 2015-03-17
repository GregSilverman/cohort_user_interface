Ext.define('cardioCatalogQT.store.Payload', {
    extend: 'Ext.data.Store',
    alias: 'store.Payload',
    // add package.framework=ext to .sencha/app/sencha.cfg
    config:{
        idProperty: 'id',
        fields: [
            {name: 'key', type: 'string'},
            {name: 'comparator', type: 'string'},
            {name: 'value', type: 'string'}
        ] ,
        storeId: 'Payload',
        autoLoad: true,

        proxy: {
            type: 'localstorage'
        }
    }
});