/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('cardioCatalogQT.Application', {
    extend: 'Ext.app.Application',
    
    name: 'cardioCatalogQT',

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function () {
        // TODO - Launch the application

        Ext.onReady(function () {

            /*var store = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'string_value',
                        type: 'string'
                    }
                ],
                proxy: {
                    type: 'ajax',
                    url: 'http://127.0.0.1:5000/api/factor',
                    reader: {
                        type: 'json',
                        rootProperty: '0'
                    }
                }
            });*/

            /* store.load(function () {
             Ext.widget('itemselector', {
             width: 300,
             height: 300,
             displayField: 'title',
             valueField: 'string_value',
             renderTo: Ext.getBody(),
             store: store
             }).center();
             });*/

            /*var is = Ext.widget('itemselector', {
                 width: 300,
                 height: 300,
                 buttons: ['add', 'remove'],
                 valueField: 'string_value',
                 displayField: 'string_value',
                 renderTo: Ext.getBody(),
                 store: store,

             }).center();*/


            var ms = Ext.create('Ext.container.Container', {
                xtype: 'multi-selector',
                width: 300,
                height: 300,
                requires: [
                    'Ext.view.MultiSelector'
                ],
                layout: 'fit',

                renderTo: Ext.getBody(),
                items: [{
                    xtype: 'multiselector',
                    title: 'Selected Dx',

                    fieldName: 'string_value',

                    viewConfig: {
                        deferEmptyText: false,
                        emptyText: 'No Dx selected'
                    },

                    search: {
                        field: 'string_value',

                        store: {
                            fields: [
                                {
                                    name: 'string_value',
                                    type: 'string'
                                }
                            ],
                            proxy: {
                                type: 'ajax',
                                url: 'http://127.0.0.1:5000/api/factor',
                                reader: {
                                    type: 'json',
                                    rootProperty: '0'
                                }
                            }
                        }
                    }
                }]
            }).center();


        });
    }


});
