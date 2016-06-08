Ext.define('cardioCatalogQT.model.tree.MedsMenu', {
    extend: 'cardioCatalogQT.model.tree.Base',
    fields: [{
        name: 'name', // task
        type: 'string'
    }, {
        name: 'type', // user
        type: 'string'
    }, {
        name: 'drug_code', // duration
        type: 'string' // float
    }]
});