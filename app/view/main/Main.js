/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('cardioCatalogQT.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'cardioCatalogQT.view.main.MainController',
        'cardioCatalogQT.view.main.MainModel'
    ],

    xtype: 'app-main',

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },

    items: [{
        xtype: 'panel',
        id: 'Test',
        styleHtmlContent: true,

        bind: {
            title: '{name}'
        },
        region: 'west',
        html: '<ul><li>Add tree menu here.</li></ul>',
        width: 250,
        split: true,
        tbar: [{
            text: 'GetData',
            handler: function() {
                var panel = Ext.getCmp('Ajax'),
                    url = 'http://127.0.0.1:5000/api/getQ/',
                    payload = 'lab:TEST_CODE;eq;13457-7;lab:RESULT_VALUE_NUM;ge;160;vital:BLOOD_PRESSURE;eq;BLOOD_PRESSURE;vital:BLOOD_PRESSURE_SYSTOLIC;ge;160';

                panel.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading...'
                });

                url += payload;

                Ext.Ajax.request({
                    url: url,
                    success: function(response) {
                        panel.setHtml(response.responseText);
                        panel.unmask();
                    }
                });
            }

        }]
    },{
        region: 'center',
        //xtype: 'tabpanel',
        xtype: 'panel',
        id: 'Ajax',
        styleHtmlContent: true,
        items:[{
            title: 'Tab 1',
            html: '<h2>Ajax test.</h2>'
        }]
    }]
});
