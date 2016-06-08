Ext.define('cardioCatalogQT.model.Query', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'query_name', type: 'string' },
        { name: 'molecule', type: 'string' },
        { name: 'remote_user', type: 'string'},
        { name: 'criteria', type: 'string'},
        { name: 'comments', type: 'string'}, // make editable
        { name: 'date_last_run', type: 'string'},
        { name: 'number_times_run', type: 'string'}
    ]
});
