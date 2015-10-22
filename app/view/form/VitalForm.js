/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.VitalForm', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.vitalGrid',
    itemId: 'vitalGrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    config: {
        variableHeights: false,
        title: 'Vitals',
        xtype: 'form',
        width: 500,
        bodyPadding: 10,
        defaults: {
            //anchor: '100%',
            labelWidth: 100
        },

        // inline buttons
        dockedItems: [ {
            itemId: 'vitals',
            items: [{ // Vitals
                xtype: 'combo',
                itemId: 'vitalStatus',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select vital status',
                displayField: 'name',
                valueField: 'value',
                store: {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'Alive', value: 'f'},
                        {name: 'Deceased', value: 'm'}
                    ]
                }
            }, {
                xtype: 'tbspacer',
                width: 50
            }, { // Vitals
                xtype: 'combo',
                itemId: 'measureCode',
                queryMode: 'local',
                editable: false,
                value: 'select',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select vital measure type',
                displayField: 'name',
                valueField: 'code',
                store: {
                    fields: ['name', 'code'],
                    data: [
                        {name: 'Select measure', code: 'select'},
                        {name: 'Systolic blood pressure', code: 'blood_pressure_systolic'},
                        {name: 'Diastolic blood pressure', code: 'blood_pressure_diastolic'}
                    ]
                },

                listeners: {
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value !== 'select') {
                            combo.up('grid').down('#measureComparator').show();
                            combo.up('grid').down('#measureValue').show();
                        } else {
                            combo.up('grid').down('#measureComparator').hide();
                            combo.up('grid').down('#measureValue').hide();
                            combo.up('grid').down('#upperMeasureValue').hide();
                            combo.up('grid').down('#measureComparator').setValue('');
                            combo.up('grid').down('#measureValue').setValue('');
                            combo.up('grid').down('#upperMeasureValue').setValue('');
                        }
                    }
                }
            }, {
                xtype: 'combo',
                flex: 1,
                itemId: 'measureComparator',
                queryMode: 'local',
                editable: false,
                value: '',
                triggerAction: 'all',
                forceSelection: true,
                fieldValue: 'that is',
                fieldLabel: 'that is',
                displayField: 'name',
                valueField: 'value',
                hidden: true,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'all', value: 'prn'},
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
                            combo.up('grid').down('#upperMeasureValue').show();
                        } else {
                            combo.up('grid').down('#upperMeasureValue').hide();
                        }
                        if (value === 'prn') {
                            combo.up('grid').down('#measureValue').hide();
                        } else {
                            combo.up('grid').down('#measureValue').show();
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                itemId: 'measureValue',
                fieldLabel: 'Min value',
                hidden: true,
                value: ''
            },
            {
                xtype: 'numberfield',
                itemId: 'upperMeasureValue',
                fieldLabel: 'and',
                hidden: true
            }, {
                xtype: 'tbspacer',
                width: 50
            }, {
                xtype: 'tbspacer',
                height:25
            }, {
                xtype: 'button',
                text: 'Constrain search by date range',
                itemId: 'showWhen',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#whenComparator').show();
                        button.up('grid').down('#whenValue').show();
                        button.up('grid').down('#hideWhen').show();
                        button.up('grid').down('#showWhen').hide();
                    }
                }
            },  {
                xtype: 'button',
                text: 'Hide date range',
                itemId: 'hideWhen',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#whenComparator').hide();
                        button.up('grid').down('#whenValue').hide();
                        button.up('grid').down('#upperWhenValue').hide();
                        button.up('grid').down('#whenComparator').setValue('');
                        button.up('grid').down('#whenValue').setValue('');
                        button.up('grid').down('#upperWhenValue').setValue('');
                        button.up('grid').down('#hideWhen').hide();
                        button.up('grid').down('#showWhen').show();
                    }
                }
            },{ // When
                xtype: 'combo',
                width: 200,
                itemId: 'whenComparator',
                queryMode: 'local',
                editable: false,
                value: '',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select vital measure date that is',
                displayField: 'name',
                valueField: 'value',
                hidden: true,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        {name: '<=', value: 'le'},
                        {name: '>=', value: 'ge'},
                        {name: 'between', value: 'bt'}
                    ]
                },

                listeners: {
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value === 'bt') {
                            combo.up('grid').down('#upperWhenValue').show();
                        } else {
                            combo.up('grid').down('#upperWhenValue').hide();
                        }
                    }
                }
            }, {
                xtype: 'datefield',
                width: 200,
                itemId: 'whenValue',
                fieldLabel: 'value of',
                hidden: true,
                hideTrigger:true
            }, {
                xtype: 'datefield',
                width: 200,
                itemId: 'upperWhenValue',
                fieldLabel: 'and',
                hidden: true,
                hideTrigger:true
            },{
                //minWidth: 80,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onSubmitVitals'
            }]
        }]

    }

});