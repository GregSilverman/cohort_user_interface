Ext.define('cardioCatalogQT.view.grid.Results', {
    extend: 'Ext.container.Container',

    alias: 'widget.resultsGrid',
    itemId: 'test',
    title: 'ExportData',

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
        store: 'Results',
        itemId:'gridTest',
        autoScroll:true,
        autoHeight: true,
        maxHeight: 500,
        columns: [{
            text: 'sid',
            dataIndex: 'sid'
        }]

    }]



});