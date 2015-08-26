Ext.define('cardioCatalogQT.model.Procedure', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'code', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'code_description', type: 'string' }
    ]
});
