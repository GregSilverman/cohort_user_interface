/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.LabForm', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.labGrid',
    itemId: 'labGrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    config: {
        variableHeights: false,
        title: 'Labs',
        xtype: 'form',
        width: 200,
        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },

        // inline buttons
        dockedItems: [{
            itemId: 'labs',
            items: [{
                xtype: 'combo',
                flex: 1,
                width: 400,
                itemId: 'labCode',
                queryMode: 'local',
                triggerAction: 'all',
                forceSelection: true,
                loading: true,
                fieldLabel: 'Select lab type',
                displayField: 'description',
                fieldName: 'description',
                valueField: 'code',
                value: '',//'13457-7',
                store: 'Labs',
                // set label with units
                listeners: {
                    change: function(combo, value) {
                        if (value) {
                            record = this.getSelectedRecord();
                            console.log(record.raw.units);
                            units = record.raw.units;
                            console.log(combo.up('grid').down('#labValue'))
                            combo.up('grid').down('#labValue').setFieldLabel('value (' + units + ')');
                        }
                    }
                }
            },
            {
                xtype: 'combo',
                flex: 1,
                itemId: 'labComparator',
                queryMode: 'local',
                editable: false,
                value: '',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'that is',
                displayField: 'name',
                valueField: 'value',
                //hidden: true,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'all', value: 'prn'},
                        {name: '=', value: 'eq'},
                        {name: '<', value: 'lt'},
                        {name: '<=', value: 'lste'},
                        {name: '>', value: 'gt'},
                        {name: '>=', value: 'grte'},
                        {name: 'between', value: 'bt'}
                    ]
                },
                listeners: {
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value === 'bt') {
                            combo.up('grid').down('#upperLabValue').show();
                        } else {
                            combo.up('grid').down('#upperLabValue').hide();
                        }
                        if (value === 'prn') {
                            combo.up('grid').down('#labValue').hide();
                        } else {
                            combo.up('grid').down('#labValue').show();
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                itemId: 'labValue',
                value: ''
            },
            {
                xtype: 'numberfield',
                itemId: 'upperLabValue',
                fieldLabel: 'and',
                hidden: true
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
            }, {
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
                fieldLabel: 'Select lab date that is',
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
                    change: function(combo, value) {
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
                handler: 'onSubmitLabs'
            }]
        }]
    }

});