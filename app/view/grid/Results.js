Ext.define('cardioCatalogQT.view.grid.Results', {
    extend: 'Ext.container.Container',

    alias: 'widget.resultsGrid',
    itemId: 'resultsGrid',
    title: 'Results',

    requires: [
        'cardioCatalogQT.view.main.MainController',
        'Ext.ux.exporter.Exporter'
    ],
    items: [{
        xtype: 'exporterbutton',
        component: '#gridTest',
        region: 'north'
    },{
        xtype: 'tbspacer',
        height: 10
    },{
        xtype: 'gridpanel',
        store: 'TestResults',
        itemId:'gridTest',
        autoScroll:true,
        autoHeight: true,
        maxHeight: 500,
        columns: [
            {
                text: 'sid',
                dataIndex: 'sid'
            },
            {
                text: 'attribute',
                dataIndex: 'attribute'
            },
            {
                text: 'string',
                dataIndex: 'value_s'
            },
            {
                text: 'number',
                dataIndex: 'value_d'
            }

        ]

    }]



});