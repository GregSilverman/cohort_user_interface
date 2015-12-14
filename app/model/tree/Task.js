Ext.define('cardioCatalogQT.model.tree.Task', {
    extend: 'cardioCatalogQT.model.tree.Base',
    fields: [{
        name: 'name', // task
        type: 'string'
    }, {
        name: 'type', // user
        type: 'string'
    }, {
        name: 'code', // duration
        type: 'string' // float
    }, {
        name: 'done',
        type: 'boolean'
    }]
});