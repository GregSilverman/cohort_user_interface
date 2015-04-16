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

    layout: 'border',
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
                src: 'resources/images/cv.png',
                height: 50,
                width: 280
            },{
                title: 'UI Sandbox'
            }],
            lbar:[{
                text: 'Login',
                xtype: 'button',

                handler: function(){
                    cardioCatalogQT.service.UtilityService.http_auth();
                }
            },{
                text: 'Show Selected Criteria',
                xtype: 'button',
                itemId: 'show',
                handler: 'onShowClick'
            },
            {
                text: 'Execute Query',
                xtype: 'button',
                itemId: 'execute',
                handler: 'onExecuteClick'
            }]
        },
        {
            title:'Results',
            region: 'central',
            xtype: 'form',
            itemId: 'results',
            flex: 1,
            styleHtmlContent: true
        },

        // Tab elements:
        // widget references to cardioCatalogQT.form
        {
            xtype: 'demographicForm'
        },

        {
            xtype: 'vitalForm'
        },

        {
            xtype: 'labForm'
        },
        {
            xtype: 'diagnosisForm'

        },
        {
            xtype: 'medicationForm'
        },
        {
            xtype: 'procedureForm'
        }
    ]
});

