/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 */

Ext.define('cardioCatalogQT.view.main.Main', {
    extend: 'Ext.Container',
    xtype: 'main-view',
    controller: 'main-view',
    requires: [
        'cardioCatalogQT.view.main.MainController',
        'cardioCatalogQT.view.main.MainModel',
        'Ext.ux.form.ItemSelector',
        'Ext.tip.QuickTipManager',
        'Ext.layout.container.Card'
    ],

    style: 'background-color:#dfe8f5;',
    width: '100%',
    height: 400,

    layout: 'border',
    defaults: {
        bodyPadding: 5
    },
    items: [{
            region: 'north',
            xtype: 'tabpanel',
            items:[{
                title:'Main'
                //xtype: 'image',
                //mode : 'image',
                //src: 'resources/images/R3D3.png',
                //height: 50,
                //width: 280
            },{
                xtype: 'demographicGrid'
            },{
                xtype: 'vitalGrid'
            },{
                xtype: 'labGrid'
            },{
                xtype: 'diagnosisGrid'
            },{
                xtype: 'medicationGrid'
            },{
                xtype: 'procedureGrid'
            },{
                xtype: 'queryGrid'
            },{
                xtype: 'resultsGrid',
                disabled: true
            }]
        },
        {
            xtype: 'toolbar',
            region: 'west',
            vertical: true,

            items: [{
                xtype: 'image',
                src: 'resources/images/R3D3.png',
                height: 50,
                width: 280
            },'-',{
                text: 'Initiate advanced request',
                xtype: 'button',

                handler: function(button){
                    var url = 'https://redcap.ahc.umn.edu/surveys/?s=nfHAssJw96';
                    window.open(url);
            }}]
        },
        {
            xtype:'searchGrid',
            region:'center'
        }
    ]
});

