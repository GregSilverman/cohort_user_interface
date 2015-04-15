/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
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
        'Ext.ux.ajax.JsonSimlet',
        'Ext.ux.ajax.SimManager',
        'Ext.layout.container.Card',
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
        // begin form elements here
        {
            title: 'Demographics',
            xtype: 'form',
            width: 200,
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            items: [{
                xtype: 'tbspacer',
                height: 25
            },{
                itemId: 'demographics',
                items: [{ // Sex
                    xtype: 'combo',
                    itemId: 'sexValue',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'Select sex',
                    displayField: 'name',
                    valueField: 'value',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name: 'female', value: 'f'},
                            {name: 'male', value: 'm'}
                        ]
                    }
                },{
                    xtype: 'tbspacer',
                    height: 50
                }, { // Age
                    xtype: 'combo',
                    itemId: 'ageComparator',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'Select age that is',
                    displayField: 'name',
                    valueField: 'value',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name: '=', value: 'eq'},
                            {name: '<', value: 'lt'},
                            {name: '<=', value: 'le'},
                            {name: '>', value: 'gt'},
                            {name: '>=', value: 'ge'},
                            {name: 'between', value: 'bt'}
                        ]
                    },

                    listeners: {
                        change: function(combo, value) {
                            // use component query to  toggle the hidden state of upper value
                            if (value === 'bt') {
                                combo.up('form').down('#upperAge').show();
                            } else {
                                combo.up('form').down('#upperAge').hide();
                            }
                        }
                    }
                },{
                    xtype: 'numberfield',
                    itemId: 'ageValue',
                    fieldLabel: 'value of',
                    value: ''
                },{
                    xtype: 'numberfield',
                    itemId: 'upperAge',
                    fieldLabel: 'and',
                    hidden: true
                }]
            }],
            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',
                handler: 'onSubmitDemographics'
            }] // end demographics
        },

        {
            title: 'Vitals',
            xtype: 'form',
            width: 200,
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            items: [{
                xtype: 'tbspacer',
                height: 25
            },{
                itemId: 'vitals',
                items: [{
                    xtype: 'combo',
                    itemId: 'systolicComparator',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'Select systolic bp that is',
                    displayField: 'name',
                    valueField: 'value',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name : '=', value: 'eq'},
                            {name : '<', value: 'lt'},
                            {name : '<=', value: 'le'},
                            {name : '>', value: 'gt'},
                            {name : '>=', value: 'ge'},
                            {name: 'between', value: 'bt'}
                        ]
                    },

                    listeners: {
                        change: function(combo, value) {
                            // use component query to  toggle the hidden state of upper value
                            if (value === 'bt') {
                                combo.up('form').down('#upperSystolic').show();
                            } else {
                                combo.up('form').down('#upperSystolic').hide();
                            }
                        }
                    }
                },{
                    xtype: 'numberfield',
                    itemId: 'systolicValue',
                    fieldLabel: 'value of',
                    value: ''
                },{
                    xtype: 'numberfield',
                    itemId: 'upperSystolic',
                    fieldLabel: 'and',
                    hidden: true
                },{
                    xtype: 'tbspacer',
                    height: 25
                },{ // Diastolic
                    xtype: 'combo',
                    itemId: 'diastolicComparator',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'Select diastolic bp that is',
                    displayField: 'name',
                    valueField: 'value',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name : '=', value: 'eq'},
                            {name : '<', value: 'lt'},
                            {name : '<=', value: 'le'},
                            {name : '>', value: 'gt'},
                            {name : '>=', value: 'ge'},
                            {name: 'between', value: 'bt'}
                        ]
                    },

                    listeners: {
                        change: function(combo, value) {
                            // use component query to  toggle the hidden state of upper value
                            if (value === 'bt') {
                                combo.up('form').down('#upperDiastolic').show();
                            } else {
                                combo.up('form').down('#upperDiastolic').hide();
                            }
                        }
                    }
                },{
                    xtype: 'numberfield',
                    itemId: 'diastolicValue',
                    fieldLabel: 'value of',
                    value: ''
                },{
                    xtype: 'numberfield',
                    itemId: 'upperDiastolic',
                    fieldLabel: 'and',
                    hidden: true
                }]
            }],
            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',
                handler: 'onSubmitVitals'
            }] // end vitals
        },

        {
            title: 'Labs', // TODO: test use of regions
            xtype: 'form',
            width: 200,
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            items: [{
                itemId: 'labs',
                items: [{
                    xtype: 'combo',
                    flex : 1,
                    width: 400,
                    itemId: 'labCode',
                    queryMode: 'local',
                    editable: false,
                    triggerAction: 'all',
                    forceSelection: true,
                    loading: true,
                    fieldLabel: 'Select lab type',
                    displayField: 'description',
                    valueField: 'code',
                    value: '13457-7',
                    store: 'Labs'
                },
                {
                    xtype: 'combo',
                    flex : 1,
                    itemId: 'labComparator',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'that is',
                    displayField: 'name',
                    valueField: 'value',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name : '=', value: 'eq'},
                            {name : '<', value: 'lt'},
                            {name : '<=', value: 'le'},
                            {name : '>', value: 'gt'},
                            {name : '>=', value: 'ge'},
                            {name : 'between', value: 'bt'}
                        ]
                    },
                    listeners: {
                        change: function(combo, value) {
                            // use component query to  toggle the hidden state of upper value
                            if (value === 'bt') {
                                combo.up('form').down('#upperLab').show();
                            } else {
                                combo.up('form').down('#upperLab').hide();
                            }
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    itemId: 'labValue',
                    fieldLabel: 'Min value',
                    value: ''
                },
                {
                    xtype: 'numberfield',
                    itemId: 'upperLab',
                    fieldLabel: 'and',
                    hidden: true
                },{
                    xtype: 'tbspacer',
                    width: 50
                },{
                    xtype: 'button',
                    text: 'Add another lab',
                    listeners: {
                        click: function(button) {
                            button.up('form').down('#labCodeSecond').show();
                            button.up('form').down('#labComparatorSecond').show();
                            button.up('form').down('#labValueSecond').show();                        }
                    }
                },{
                    xtype: 'combo',
                    flex : 1,
                    width: 400,
                    itemId: 'labCodeSecond',
                    queryMode: 'local',
                    editable: false,
                    triggerAction: 'all',
                    forceSelection: true,
                    loading: true,
                    fieldLabel: 'Select lab type',
                    displayField: 'description',
                    valueField: 'code',
                        hidden: true,
                    value: '',
                    store: 'Labs'
                },
                {
                    xtype: 'combo',
                    flex : 1,
                    itemId: 'labComparatorSecond',
                    queryMode: 'local',
                    editable: false,
                    value: 'eq',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: 'that is',
                    displayField: 'name',
                    valueField: 'value',
                    hidden: true,
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {name : '=', value: 'eq'},
                            {name : '<', value: 'lt'},
                            {name : '<=', value: 'le'},
                            {name : '>', value: 'gt'},
                            {name : '>=', value: 'ge'},
                            {name : 'between', value: 'bt'}
                        ]
                    },
                    listeners: {
                        change: function(combo, value) {
                            // use component query to  toggle the hidden state of upper value
                            if (value === 'bt') {
                                combo.up('form').down('#upperLabSecond').show();
                            } else {
                                combo.up('form').down('#upperLabSecond').hide();
                            }
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    itemId: 'labValueSecond',
                    fieldLabel: 'Min value',
                    value: '',
                    hidden: true
                },
                {
                    xtype: 'numberfield',
                    itemId: 'upperLabSecond',
                    fieldLabel: 'and',
                    hidden: true
                }]
            }],
            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',
                handler: 'onSubmitLabs'
            }] // end test lab
        },

        {
            title: 'Diagnoses',
            xtype: 'form',
            items: [{ //Dx
                width: 300,
                xtype: 'multiselector',
                title: 'Selected Dx',
                itemId: 'diagnosis',
                fieldName: 'description',
                valueField:'code',
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: 'No Dx selected'
                },
                // TODO: fix ability to remove selected items when box is unchecked
                search: {
                    field: 'description',
                    store: 'Diagnoses',

                    search: function (text) {
                        cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                    }
                }
            }],
            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',
                handler: 'onSubmitDiagnoses'
            }]

        },

        {
            title: 'Medications',
            xtype: 'form',
            items: [{
                width: 300,
                xtype: 'multiselector',
                title: 'Selected Rx',
                itemId: 'medication',
                fieldName: 'description',
                valueField:'code',
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: 'No Rx selected'
                },
                // TODO: fix ability to remove selected items when box is unchecked
                search: {
                    field: 'description',
                    store: 'Medications',

                    search: function (text) {
                        cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                    }
                }
            }],
            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',
                handler: 'onSubmitMedications'

            }]

        },

        {
            title: 'Procedures',
            xtype: 'form',
            items: [{
                width: 300,
                xtype: 'multiselector',
                title: 'Selected Px',
                itemId: 'procedure',
                fieldName: 'description',
                valueField:'code',
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: 'No Px selected'
                },
                // TODO: fix ability to remove selected items when box is unchecked
                search: {
                    field: 'description',
                    store: 'Procedures',

                    search: function (text) {
                        cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                    }
                }
            }],
            lbar:[{
                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',
                text: 'Save criteria',
                handler: 'onSubmitProcedures'
            }]
        }
    ]
});

