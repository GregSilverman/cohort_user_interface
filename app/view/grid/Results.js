Ext.define('cardioCatalogQT.view.grid.Results', {
    extend: 'Ext.form.Panel',

    alias: 'widget.resultsGrid',
    itemId: 'test',
    flex: 1,
    styleHtmlContent: true,
    title: 'Test',

    //controller: 'main-view',
    requires: [
        'cardioCatalogQT.view.main.MainController',
        'Ext.ux.exporter.Exporter'
    ],

    items: [{
        xtype: 'tbspacer',
        height: 25
    }, {
        xtype: 'grid',
        store: 'Results',
        itemId:'gridTest',
        scrollable: true,
        columns: [{
            text: 'sid',
            xtype: 'templatecolumn',
            dataIndex: 'sid',
            tpl: '{sid}'
        }]

    },{
        xtype: 'exportbutton',
        store: 'Results'
        //Or you can use
        //component: someGrid
        //component: someTree
        //component: '#someGridItemId'
    }]



});