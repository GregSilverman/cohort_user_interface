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

        /*  xtype: 'combo',
         flex: 1,
         width: 400,
         itemId: 'labCode',
         queryMode: 'local',
         //editable: false,
         triggerAction: 'all',
         forceSelection: true,
         loading: true,
         fieldLabel: 'Select lab type',
         displayField: 'description',
         fieldName: 'description',
         valueField: 'code',
         value: '',//'13457-7',
         store: 'Labs',*/

        // inline buttons
        dockedItems: [ {
            itemId: 'vitals',
            items: [ { // Vitals
                xtype: 'combo',
                flex: 1,
                width: 400,
                itemId: 'measureCode',
                queryMode: 'local',
                editable: false,
                value: 'select',
                triggerAction: 'all',
                forceSelection: true,
                loading: true,
                fieldLabel: 'Select vital measure type',
                displayField: 'measure',
                valueField: 'field_name',
                store: 'BasicVitals',
                listeners: {
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value !== 'select') {
                            combo.up('grid').down('#measureComparator').show();
                        } else {
                            combo.up('grid').down('#measureComparator').hide();
                            combo.up('grid').down('#measureValue').hide();
                            combo.up('grid').down('#upperMeasureValue').hide();
                            combo.up('grid').down('#measureComparator').setValue('');
                            combo.up('grid').down('#measureValue').setValue('');
                            combo.up('grid').down('#upperMeasureValue').setValue('');
                        }
                        // set label with units
                        if (value) {
                            record = this.getSelectedRecord();
                            console.log(record.raw.units);
                            units = record.raw.units;
                            console.log(combo.up('grid').down('#measureValue'))
                            if (record.raw.units) {
                                combo.up('grid').down('#measureValue').setFieldLabel('min value in ' + Ext.util.Format.lowercase(units));
                            }
                            else {
                                combo.up('grid').down('#measureValue').setFieldLabel('min value:');
                            }
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
                        //{name: 'all', value: 'prn'},
                        {name: '=', value: 'eq'},
                        {name: '<', value: 'lt'},
                        {name: '<=', value: 'lete'},
                        {name: '>', value: 'gt'},
                        {name: '>=', value: 'grte'},
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
            },{
                xtype: 'label',
                itemId: 'measureUnits'
            },

            {
                xtype: 'textfield',
                itemId: 'measureValue',
                //fieldLabel: 'Min value',
                hidden: true,
                value: '',
                listeners: {
                    change: function (fld, newValue, oldValue, opts) {
                        // only enable if a value is being submitted
                        if (newValue) {
                            fld.up('grid').down('#searchClick').enable();
                        }
                        else if (!newValue){
                            fld.up('grid').down('#searchClick').disable();
                        }
                    }
                }
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
                disabled: true,
                itemId: 'searchClick',
                handler: 'onSubmitVitals'
            }]
        }]

    }

});