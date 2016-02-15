Ext.define('cardioCatalogQT.model.TestResult', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'attribute', type: 'string'},
        {name: 'sid', type: 'string'},
        {name: 'value_s', type: 'string'},
        {name: 'value_d', type: 'string'}
    ]

});