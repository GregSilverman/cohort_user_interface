Ext.define('cardioCatalogQT.store.Queries', {
    extend: 'Ext.data.Store',
    alias: 'store.Queries',
    // add package.framework=ext to .sencha/app/sencha.cfg
    config:{
        idProperty: 'id',
        fields: [
            {name: 'url', type: 'string'},
            {name: 'user', type: 'string'}
        ] ,

        storeId: 'Queries',
        autoLoad: true,

        proxy: {
            type: 'localstorage',
            id: 'queries'
        }
    }
});