Ext.define('cardioCatalogQT.model.Query', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'query_name', type: 'string' },
        { name: 'molecule', type: 'string' }
    ]
});
