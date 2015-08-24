/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 */

Ext.define('cardioCatalogQT.view.main.Main', {
    extend: 'Ext.tab.Panel',
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

    layout: 'vbox',
    defaults: {
        bodyPadding: 5
    },
    items: [{
            title:'Main',
            region: 'south',
            xtype: 'form',
            itemId: 'Ajax',
            flex: 1,
            styleHtmlContent: true,
            items:[{
                xtype: 'image',
                src: 'resources/images/R3D3.png',
                height: 50,
                width: 280
            },{
                title: 'Ad Hoc Sandbox for Cohort Discovery'
            }] ,
            lbar:[{
                text: 'Initiate advanced request',
                xtype: 'button',

                handler: function(button){
                    var url = 'https://redcap.ahc.umn.edu/surveys/?s=nfHAssJw96';
                    //cardioCatalogQT.service.UtilityService.http_auth(button);
                    window.open(url);
                }
            }]
        },
        {
            xtype: 'resultsGrid'
            //disabled: true
        },
        /*{
            xtype: 'searchGrid'
            //disabled: true
        },*/
        {
            xtype: 'demographicGrid'
            //disabled: true
        },
        {
            xtype: 'vitalGrid'
            //disabled: true
        },
        {
            xtype: 'labGrid'
            //disabled: true
        },
        {
            xtype: 'diagnosisGrid'
            //disabled: true

        },
        {
            xtype: 'medicationGrid'
            //disabled: true
        },
        {
            xtype: 'procedureGrid'
            //disabled: true
        }
    ]
});

